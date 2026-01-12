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

            userRepository.findByUsername(username).ifPresentOrElse(
                    user -> {
                        // Reset password if user exists
                        user.setPassword(passwordEncoder.encode(password));
                        user.setRole(role); // Ensure role is ADMIN
                        userRepository.save(user);
                        System.out.println("✅ Admin password reset to: " + password);
                    },
                    () -> {
                        // Create user if not exists
                        User user = new User();
                        user.setUsername(username);
                        user.setPassword(passwordEncoder.encode(password));
                        user.setName("Admin");
                        user.setRole(role);
                        userRepository.save(user);
                        System.out.println("✅ Admin user created with password: " + password);
                    });
        };
    }
}
