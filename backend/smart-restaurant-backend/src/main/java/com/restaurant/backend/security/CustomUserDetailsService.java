package com.restaurant.backend.security;

import com.restaurant.backend.user.model.User;
import com.restaurant.backend.user.repository.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));

        // Prefix role with ROLE_ if needed by Spring Security default voter, but we
        // usually handle it manually or configure it
        // Let's ensure it's ROLE_ADMIN etc. or just ADMIN and we configure
        // hasAuthority("ADMIN") vs hasRole("ADMIN")
        // We'll use SimpleGrantedAuthority with the role string directly.
        // Assuming database stores "ADMIN", "CUSTOMER".
        // Spring Security "hasRole" adds "ROLE_" prefix check automatically.
        // "hasAuthority" checks exact string.
        // I'll stick to storing "ROLE_ADMIN" in DB or prepending it here.
        // Let's prepend "ROLE_" here for standard compatibility.

        String roleName = user.getRole();
        if (!roleName.startsWith("ROLE_")) {
            roleName = "ROLE_" + roleName;
        }

        return new org.springframework.security.core.userdetails.User(
                user.getUsername(),
                user.getPassword(),
                Collections.singletonList(new SimpleGrantedAuthority(roleName)));
    }
}
