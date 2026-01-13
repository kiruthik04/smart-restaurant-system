package com.restaurant.backend.security.dto;

import lombok.Data;

@Data
public class RegisterRequest {
    private String username;
    private String password;
    private String name;
    private String email;
    private String role; // Optional, default to CUSTOMER if null
}
