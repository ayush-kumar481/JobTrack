package com.jobtrack.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.Objects;

@Service
public class JwtService {

    private final SecretKey key;

    private static final long EXPIRATION_TIME =
            1000 * 60 * 60; // 1 hour

    public JwtService(@Value("${jwt.secret}") String secret) {
        this.key = Keys.hmacShaKeyFor(
                secret.getBytes(StandardCharsets.UTF_8)
        );
    }

    public String generateToken(String email) {
        return Jwts.builder()
                .subject(email)
                .claim("purpose", "access")
                .issuedAt(new Date())
                .expiration(
                        new Date(System.currentTimeMillis()
                                + EXPIRATION_TIME)
                )
                .signWith(key)
                .compact();
    }

    public String generatePasswordResetToken(String email) {
        return Jwts.builder()
                .subject(email)
                .claim("purpose", "password-reset")
                .issuedAt(new Date())
                .expiration(
                        new Date(System.currentTimeMillis()
                                + (15 * 60 * 1000))
                )
                .signWith(key)
                .compact();
    }

    public String extractEmail(String token) {
        return extractAllClaims(token).getSubject();
    }

    public boolean isTokenValid(String token) {
        try {
            Claims claims = extractAllClaims(token);

            return claims.getExpiration().after(new Date());

        } catch (Exception e) {
            return false;
        }
    }

    public boolean isPasswordResetToken(String token) {
        try {
            return Objects.equals(
                    extractAllClaims(token).get("purpose", String.class),
                    "password-reset");
        } catch (Exception e) {
            return false;
        }
    }

    public boolean isAccessToken(String token) {
        try {
            return isTokenValid(token) && Objects.equals(
                    extractAllClaims(token).get("purpose", String.class),
                    "access");
        } catch (Exception e) {
            return false;
        }
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}
