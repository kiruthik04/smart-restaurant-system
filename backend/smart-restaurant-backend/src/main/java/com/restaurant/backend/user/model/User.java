package com.restaurant.backend.user.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String role; // ADMIN, CUSTOMER, KITCHEN

    private String name;

    @Column(unique = true, nullable = false)
    private String email;

    private String resetToken;

    private java.time.LocalDateTime resetTokenExpiry;
}
