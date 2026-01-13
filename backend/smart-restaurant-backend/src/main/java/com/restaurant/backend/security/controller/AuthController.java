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
            return ResponseEntity.ok("If an account exists with that email, a reset link has been sent.");
        }

        String token = java.util.UUID.randomUUID().toString();
        user.setResetToken(token);
        user.setResetTokenExpiry(java.time.LocalDateTime.now().plusMinutes(15));
        userRepository.save(user);

        String resetLink = "http://localhost:3000/reset-password?token=" + token;
        // String resetLink = "https://smartrestro.vercel.app/reset-password?token=" +
        // token; // Prod URL

        System.out.println("DEBUG: Reset Token for " + email + ": " + token);

        try {
            emailService.sendSimpleMessage(email, "Password Reset Request",
                    "Click the link to reset your password: " + resetLink);
        } catch (Exception e) {
            System.err.println("Failed to send email: " + e.getMessage());
            // Don't error out to the user
        }

        return ResponseEntity.ok("If an account exists with that email, a reset link has been sent.");
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody java.util.Map<String, String> request) {
        String token = request.get("token");
        String newPassword = request.get("newPassword");

        if (token == null || newPassword == null) {
            return ResponseEntity.badRequest().body("Token and new password are required");
        }

        User user = userRepository.findByResetToken(token).orElse(null);
        if (user == null || user.getResetTokenExpiry().isBefore(java.time.LocalDateTime.now())) {
            return ResponseEntity.badRequest().body("Invalid or expired token");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        user.setResetToken(null);
        user.setResetTokenExpiry(null);
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
}
