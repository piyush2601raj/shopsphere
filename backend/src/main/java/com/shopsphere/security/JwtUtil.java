package com.shopsphere.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {

    // ✅ Strong secret (IMPORTANT FIX)
    private static final String SECRET =
            "shopsphere_super_secure_secret_key_1234567890_very_long_key_123456";

    private Key getSignKey() {
        return Keys.hmacShaKeyFor(SECRET.getBytes(StandardCharsets.UTF_8));
    }

    // 🔐 GENERATE TOKEN
    public String generateToken(String email, String role) {

        return Jwts.builder()
                .setSubject(email)
                .claim("role", role)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 10)) // 10 hours
                .signWith(getSignKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    // 📩 EXTRACT EMAIL
    public String extractEmail(String token) {
        return extractAllClaims(token).getSubject();
    }

    // 📩 EXTRACT ROLE
    public String extractRole(String token) {
        return extractAllClaims(token).get("role", String.class);
    }

    // 🔍 PARSE TOKEN (IMPROVED ERROR HANDLING)
    private Claims extractAllClaims(String token) {
        try {
            return Jwts.parserBuilder()
                    .setSigningKey(getSignKey())
                    .build()
                    .parseClaimsJws(token)
                    .getBody();

        } catch (ExpiredJwtException e) {
            throw new RuntimeException("Token expired");
        } catch (UnsupportedJwtException e) {
            throw new RuntimeException("Unsupported token");
        } catch (MalformedJwtException e) {
            throw new RuntimeException("Invalid token format");
        } catch (SignatureException e) {
            throw new RuntimeException("Invalid signature");
        }
    }

    // ⏳ CHECK EXPIRY
    private boolean isTokenExpired(String token) {
        return extractAllClaims(token)
                .getExpiration()
                .before(new Date());
    }

    // ✅ VALIDATE TOKEN
    public boolean validateToken(String token, String email) {
        try {
            return extractEmail(token).equals(email)
                    && !isTokenExpired(token);
        } catch (Exception e) {
            return false;
        }
    }
}