package com.restaurant.auth_service.controller;

import com.restaurant.auth_service.dto.AuthResponse;
import com.restaurant.auth_service.dto.LoginRequest;
import com.restaurant.auth_service.dto.RegisterRequest;
import com.restaurant.auth_service.service.AuthService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService service;

    public AuthController(AuthService service) {
        this.service = service;
    }

    @PostMapping("/register")
    public void register(@RequestBody RegisterRequest request) {
        service.register(request);
    }

    @PostMapping("/login")
    public AuthResponse login(@RequestBody LoginRequest request) {
        return service.login(request);
    }
}
