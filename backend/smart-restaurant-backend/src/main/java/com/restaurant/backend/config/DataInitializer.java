package com.restaurant.backend.config;

import com.restaurant.backend.user.model.User;
import com.restaurant.backend.user.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner initData(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            String username = "admin";
            String password = "admin123";
            String role = "ADMIN";

            if (userRepository.findByUsername(username).isEmpty()) {
                // Create user if not exists
                User user = new User();
                user.setUsername(username);
                user.setPassword(passwordEncoder.encode(password));
                user.setName("Admin");
                user.setRole(role);
                userRepository.save(user);
                System.out.println("✅ Admin user created with password: " + password);
            } else {
                System.out.println("ℹ️ Admin user already exists. Skipping creation.");
            }
        };
    }
}
