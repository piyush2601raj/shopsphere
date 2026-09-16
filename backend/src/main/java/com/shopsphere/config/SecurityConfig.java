package com.shopsphere.config;

import com.shopsphere.security.JwtFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
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
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http
            .csrf(csrf -> csrf.disable())

            // ⚠️ IMPORTANT: enable cors instead of disabling
            .cors(cors -> cors.disable())

            .sessionManagement(session ->
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )

            .authorizeHttpRequests(auth -> auth

                // =========================
                // PUBLIC APIs
                // =========================
                .requestMatchers("/auth/**").permitAll()
                .requestMatchers("/products/**").permitAll()
                .requestMatchers("/categories/**").permitAll()
                .requestMatchers("/api/product-images/**").permitAll()
                .requestMatchers("/api/admin/login").permitAll()

                // =========================
                // ADMIN APIs
                // =========================
                .requestMatchers("/api/admin/**").hasAuthority("ROLE_ADMIN")

                // =========================
                // PROTECTED APIs (JWT required logically, but not blocked at filter level)
                // =========================
                .requestMatchers("/users/**").permitAll()
                .requestMatchers("/orders/**").permitAll()
                .requestMatchers("/cart/**").permitAll()
                .requestMatchers("/payments/**").permitAll()
                .requestMatchers("/api/wishlist/**").permitAll()
                .requestMatchers("/api/address/**").permitAll()

                // =========================
                // FALLBACK (IMPORTANT FIX)
                // =========================
                .anyRequest().permitAll()
            )

            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}