package com.restaurant.backend.security.controller;

import com.restaurant.backend.security.JwtUtil;
import com.restaurant.backend.security.dto.AuthRequest;
import com.restaurant.backend.security.dto.AuthResponse;
import com.restaurant.backend.security.dto.RegisterRequest;
import com.restaurant.backend.user.model.User;
import com.restaurant.backend.user.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;
    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final com.restaurant.backend.service.EmailService emailService;

    public AuthController(AuthenticationManager authenticationManager,
            UserDetailsService userDetailsService,
            JwtUtil jwtUtil,
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            com.restaurant.backend.service.EmailService emailService) {
        this.authenticationManager = authenticationManager;
        this.userDetailsService = userDetailsService;
        this.jwtUtil = jwtUtil;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.emailService = emailService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest request) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword()));
        } catch (Exception e) {
            return ResponseEntity.status(401).body("Invalid username or password");
        }

        final UserDetails userDetails = userDetailsService.loadUserByUsername(request.getUsername());

        // Fetch role from DB to include in response
        User user = userRepository.findByUsername(request.getUsername()).orElseThrow();

        if (!user.isVerified()) {
            return ResponseEntity.status(403).body("Account not verified. Please verify your email.");
        }

        final String token = jwtUtil.generateToken(userDetails.getUsername(), user.getRole());

        return ResponseEntity.ok(new AuthResponse(token, user.getUsername(), user.getRole(), user.getId()));
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            return ResponseEntity.badRequest().body("Username already exists");
        }
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Email already registered");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setVerified(false);

        // Default role if not provided
        String role = request.getRole() != null ? request.getRole().toUpperCase() : "CUSTOMER";
        if (!role.equals("ADMIN") && !role.equals("CUSTOMER") && !role.equals("KITCHEN")) {
            return ResponseEntity.badRequest().body("Invalid role. Allowed: ADMIN, CUSTOMER, KITCHEN");
        }
        user.setRole(role);

        // Generate OTP
        String otp = String.format("%06d", new java.util.Random().nextInt(999999));
        user.setOtp(otp);
        user.setOtpExpiry(java.time.LocalDateTime.now().plusMinutes(10));

        userRepository.save(user);

        // Send OTP Email
        try {
            String htmlContent = generateOtpEmailTemplate(otp, "verify your account");
            emailService.sendHtmlMessage(request.getEmail(), "Welcome to Love, Rosie! Verify your Email", htmlContent);
        } catch (Exception e) {
            System.err.println("Failed to send email: " + e.getMessage());
            return ResponseEntity.internalServerError().body("Failed to send verification email");
        }

        return ResponseEntity.ok(java.util.Map.of(
                "message", "Registration successful. Please check your email for OTP.",
                "status", "OTP_SENT",
                "email", user.getEmail()));
    }

    @PostMapping("/verify-registration")
    public ResponseEntity<?> verifyRegistration(@RequestBody java.util.Map<String, String> request) {
        String email = request.get("email");
        String otp = request.get("otp");

        if (email == null || otp == null) {
            return ResponseEntity.badRequest().body("Email and OTP are required");
        }

        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null) {
            return ResponseEntity.badRequest().body("User not found");
        }

        if (user.isVerified()) {
            return ResponseEntity.ok("User already verified");
        }

        if (user.getOtp() == null || !user.getOtp().equals(otp)
                || user.getOtpExpiry().isBefore(java.time.LocalDateTime.now())) {
            return ResponseEntity.badRequest().body("Invalid or expired OTP");
        }

        user.setVerified(true);
        user.setOtp(null);
        user.setOtpExpiry(null);
        userRepository.save(user);

        return ResponseEntity.ok("Account verified successfully. You can now login.");
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody java.util.Map<String, String> request) {
        String email = request.get("email");
        if (email == null) {
            return ResponseEntity.badRequest().body("Email is required");
        }

        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null) {
            // For security, don't reveal if user exists
            return ResponseEntity.ok("If an account exists with that email, an OTP has been sent.");
        }

        // Generate 6-digit OTP
        String otp = String.format("%06d", new java.util.Random().nextInt(999999));
        user.setOtp(otp);
        user.setOtpExpiry(java.time.LocalDateTime.now().plusMinutes(5));
        userRepository.save(user);

        System.out.println("DEBUG: OTP for " + email + ": " + otp);

        try {
            String htmlContent = generateOtpEmailTemplate(otp, "reset your password");
            emailService.sendHtmlMessage(email, "Password Reset Verification", htmlContent);
        } catch (Exception e) {
            System.err.println("Failed to send email: " + e.getMessage());
        }

        return ResponseEntity.ok("If an account exists with that email, an OTP has been sent.");
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestBody java.util.Map<String, String> request) {
        String email = request.get("email");
        String otp = request.get("otp");

        if (email == null || otp == null) {
            return ResponseEntity.badRequest().body("Email and OTP are required");
        }

        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null || user.getOtp() == null || !user.getOtp().equals(otp)
                || user.getOtpExpiry().isBefore(java.time.LocalDateTime.now())) {
            return ResponseEntity.badRequest().body("Invalid or expired OTP");
        }

        return ResponseEntity.ok("OTP verified successfully");
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody java.util.Map<String, String> request) {
        String email = request.get("email");
        String otp = request.get("otp");
        String newPassword = request.get("newPassword");

        if (email == null || otp == null || newPassword == null) {
            return ResponseEntity.badRequest().body("Email, OTP, and new password are required");
        }

        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null || user.getOtp() == null || !user.getOtp().equals(otp)
                || user.getOtpExpiry().isBefore(java.time.LocalDateTime.now())) {
            return ResponseEntity.badRequest().body("Invalid or expired OTP");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        user.setOtp(null);
        user.setOtpExpiry(null);
        userRepository.save(user);

        return ResponseEntity.ok("Password has been reset successfully");
    }

    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody java.util.Map<String, String> request) {
        String username = org.springframework.security.core.context.SecurityContextHolder.getContext()
                .getAuthentication().getName();
        String oldPassword = request.get("oldPassword");
        String newPassword = request.get("newPassword");

        if (oldPassword == null || newPassword == null) {
            return ResponseEntity.badRequest().body("Old and new passwords are required");
        }

        User user = userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
            return ResponseEntity.badRequest().body("Incorrect old password");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        return ResponseEntity.ok("Password changed successfully");
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(@RequestBody java.util.Map<String, String> request) {
        String username = org.springframework.security.core.context.SecurityContextHolder.getContext()
                .getAuthentication().getName();
        String newName = request.get("name");
        String newEmail = request.get("email");

        User user = userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));

        boolean emailChanged = false;

        if (newName != null && !newName.isBlank()) {
            user.setName(newName);
        }

        if (newEmail != null && !newEmail.isBlank() && !newEmail.equals(user.getEmail())) {
            // Check if email is taken by another user
            userRepository.findByEmail(newEmail).ifPresent(existingUser -> {
                if (!existingUser.getId().equals(user.getId())) {
                    throw new IllegalArgumentException("Email already in use");
                }
            });

            // Generate OTP for email change
            String otp = String.format("%06d", new java.util.Random().nextInt(999999));
            user.setNewEmail(newEmail);
            user.setNewEmailOtp(otp);
            user.setNewEmailOtpExpiry(java.time.LocalDateTime.now().plusMinutes(5));
            emailChanged = true;

            System.out.println("DEBUG: Email Change OTP for " + newEmail + ": " + otp);

            try {
                String htmlContent = generateOtpEmailTemplate(otp, "update your email address");
                emailService.sendHtmlMessage(newEmail, "Email Change Verification", htmlContent);
            } catch (Exception e) {
                System.err.println("Failed to send email: " + e.getMessage());
            }
        }

        userRepository.save(user);

        java.util.Map<String, Object> response = new java.util.HashMap<>();
        response.put("username", user.getUsername());
        response.put("name", user.getName() != null ? user.getName() : "");
        response.put("email", user.getEmail());
        response.put("role", user.getRole());
        response.put("id", user.getId());

        if (emailChanged) {
            response.put("status", "OTP_SENT");
            response.put("message", "OTP sent to new email. Please verify.");
        }

        return ResponseEntity.ok(response);
    }

    @PostMapping("/verify-email-change")
    public ResponseEntity<?> verifyEmailChange(@RequestBody java.util.Map<String, String> request) {
        String username = org.springframework.security.core.context.SecurityContextHolder.getContext()
                .getAuthentication().getName();
        String otp = request.get("otp");

        if (otp == null) {
            return ResponseEntity.badRequest().body("OTP is required");
        }

        User user = userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getNewEmail() == null || user.getNewEmailOtp() == null || !user.getNewEmailOtp().equals(otp)
                || user.getNewEmailOtpExpiry().isBefore(java.time.LocalDateTime.now())) {
            return ResponseEntity.badRequest().body("Invalid or expired OTP");
        }

        // Apply Validated Change
        user.setEmail(user.getNewEmail());
        user.setNewEmail(null);
        user.setNewEmailOtp(null);
        user.setNewEmailOtpExpiry(null);
        userRepository.save(user);

        return ResponseEntity.ok(java.util.Map.of(
                "success", true,
                "message", "Email updated successfully",
                "email", user.getEmail()));
    }

    private String generateOtpEmailTemplate(String otp, String action) {
        return """
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
                        .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 40px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
                        .header { text-align: center; margin-bottom: 30px; }
                        .header h1 { color: #2c3e50; margin: 0; font-size: 28px; letter-spacing: 1px; }
                        .content { color: #555555; line-height: 1.6; font-size: 16px; }
                        .otp-box { background-color: #f8f9fa; border: 2px dashed #e9ecef; border-radius: 8px; padding: 20px; text-align: center; margin: 30px 0; }
                        .otp { font-size: 36px; font-weight: bold; color: #dc3545; letter-spacing: 8px; font-family: monospace; }
                        .footer { text-align: center; margin-top: 40px; font-size: 12px; color: #999999; border-top: 1px solid #eeeeee; padding-top: 20px; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>Love, Rosie</h1>
                        </div>
                        <div class="content">
                            <p>Hello,</p>
                            <p>You requested to <strong>%s</strong>. Please use the verification code below to complete this action:</p>
                            <div class="otp-box">
                                <div class="otp">%s</div>
                            </div>
                            <p>This code will expire in 5 minutes.</p>
                            <p>If you did not request this, please ignore this email or contact support if you have concerns.</p>
                        </div>
                        <div class="footer">
                            <p>&copy; 2024 Love, Rosie. All rights reserved.</p>
                        </div>
                    </div>
                </body>
                </html>
                """
                .formatted(action, otp);
    }
}
