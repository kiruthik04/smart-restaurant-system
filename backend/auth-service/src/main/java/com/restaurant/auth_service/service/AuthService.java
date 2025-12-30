package com.restaurant.auth_service.service;

import com.restaurant.auth_service.dto.AuthResponse;
import com.restaurant.auth_service.dto.LoginRequest;
import com.restaurant.auth_service.dto.RegisterRequest;
import com.restaurant.auth_service.model.User;
import com.restaurant.auth_service.repository.UserRepository;
import com.restaurant.auth_service.security.JwtUtil;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository repository;
    private final PasswordEncoder encoder;
    private final JwtUtil jwtUtil;

    public AuthService(UserRepository repository,
                       PasswordEncoder encoder,
                       JwtUtil jwtUtil) {
        this.repository = repository;
        this.encoder = encoder;
        this.jwtUtil = jwtUtil;
    }

    public void register(RegisterRequest request) {

        if (repository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }

        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(encoder.encode(request.getPassword()));
        user.setRole(request.getRole());

        repository.save(user);
    }

    public AuthResponse login(LoginRequest request) {

        User user = repository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));

        if (!encoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        String token = jwtUtil.generateToken(user);
        return new AuthResponse(token, user.getRole().name());
    }
}
