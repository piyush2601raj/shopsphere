package com.shopsphere.config;


import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;

import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;


import com.shopsphere.security.JwtFilter;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {

    private final JwtFilter jwtFilter;

    public SecurityConfig(JwtFilter jwtFilter) {
        this.jwtFilter = jwtFilter;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http)
            throws Exception {

        http

            // =========================
            // CSRF
            // =========================
            .csrf(csrf -> csrf.disable())

            // =========================
            // CORS
            // Uses CorsConfig.java
            // =========================
            .cors(cors -> {})

            // =========================
            // SESSION
            // =========================
            .sessionManagement(session ->
                session.sessionCreationPolicy(
                    SessionCreationPolicy.STATELESS
                )
            )

            // =========================
            // AUTHORIZATION
            // =========================
            .authorizeHttpRequests(auth -> auth

                // CORS PREFLIGHT
                .requestMatchers(
                    HttpMethod.OPTIONS,
                    "/**"
                ).permitAll()

                // =========================
                // PUBLIC APIs
                // =========================
                .requestMatchers("/auth/**").permitAll()

                .requestMatchers("/products/**").permitAll()

                .requestMatchers("/categories/**").permitAll()

                .requestMatchers("/subcategories/**").permitAll()

                .requestMatchers("/api/product-images/**").permitAll()

                .requestMatchers("/api/admin/login").permitAll()

                .requestMatchers("/payments/**").permitAll()

                .requestMatchers("/api/reviews/product/**").permitAll()

                // =========================
                // ADMIN APIs
                // =========================
                .requestMatchers("/api/admin/**")
                .hasAuthority("ROLE_ADMIN")

                // =========================
                // OTHER APIs
                // =========================
                .requestMatchers("/users/**").permitAll()

                .requestMatchers("/orders/**").permitAll()

                .requestMatchers("/cart/**").permitAll()

                .requestMatchers("/api/wishlist/**").permitAll()

                .requestMatchers("/api/address/**").permitAll()

                // =========================
                // FALLBACK
                // =========================
                .anyRequest().permitAll()
            )

            // =========================
            // JWT FILTER
            // =========================
            .addFilterBefore(
                jwtFilter,
                UsernamePasswordAuthenticationFilter.class
            );

        return http.build();
    }

    // =========================
    // PASSWORD ENCODER
    // =========================
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}