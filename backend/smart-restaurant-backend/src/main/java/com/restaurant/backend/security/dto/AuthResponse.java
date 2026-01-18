package com.restaurant.backend.security.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private String username;
    private String role;
    private String userId;
    private String email;
    private String name;
    private String mobileNumber;
}
