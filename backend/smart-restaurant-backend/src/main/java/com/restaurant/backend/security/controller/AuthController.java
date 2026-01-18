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

        final String token = jwtUtil.generateToken(userDetails.getUsername(), user.getRole());

        return ResponseEntity.ok(new AuthResponse(token, user.getUsername(), user.getRole(), user.getId()));
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            return ResponseEntity.badRequest().body("Username already exists");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setName(request.getName());
        user.setEmail(request.getEmail()); // Ensure RegisterRequest has this too, need to check DTO

        // Default role if not provided
        String role = request.getRole() != null ? request.getRole().toUpperCase() : "CUSTOMER";
        // Basic validation for roles
        if (!role.equals("ADMIN") && !role.equals("CUSTOMER") && !role.equals("KITCHEN")) {
            return ResponseEntity.badRequest().body("Invalid role. Allowed: ADMIN, CUSTOMER, KITCHEN");
        }
        user.setRole(role);

        userRepository.save(user);

        return ResponseEntity.ok("User registered successfully");
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
            emailService.sendSimpleMessage(email, "Password Reset OTP",
                    "Your OTP for password reset is: " + otp + "\nIt expires in 5 minutes.");
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
                emailService.sendSimpleMessage(newEmail, "Verify Email Change",
                        "Your OTP for email change is: " + otp + "\nIt expires in 5 minutes.");
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
}
