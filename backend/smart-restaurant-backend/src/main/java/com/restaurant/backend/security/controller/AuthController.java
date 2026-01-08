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

    public AuthController(AuthenticationManager authenticationManager,
            UserDetailsService userDetailsService,
            JwtUtil jwtUtil,
            UserRepository userRepository,
            PasswordEncoder passwordEncoder) {
        this.authenticationManager = authenticationManager;
        this.userDetailsService = userDetailsService;
        this.jwtUtil = jwtUtil;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
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
}
