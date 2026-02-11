package com.example.task_manager.config.jwt;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import com.example.task_manager.user.entity.UserEntity;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;

/**
 * Service for handling JWT operations.
 */
@Service
public class JwtService {

  // JWT secret key fetched from environment variables
  @Value("${jwt.secret}")
  private String secret;

  // JWT expiration time in milliseconds fetched from application properties
  @Value("${jwt.expiration-ms}")
  private long expiration;

  /**
   * Generates a JWT token for the given user.
   */
  public String generateToken(UserEntity user) {

    return Jwts.builder()
        .setSubject(user.getEmail())
        .claim("role", user.getRole().name())
        .claim("userId", user.getId())
        .setIssuedAt(new Date())
        .setExpiration(
            new Date(System.currentTimeMillis() + expiration))
        .signWith(getKey())
        .compact();
  }

  /**
   * Extracts the email from a JWT token.
   */
  public String extractEmail(String token) {
    return getClaims(token).getSubject();
  }

  /**
   * Validates a JWT token.
   */
  public boolean isTokenValid(String token, UserDetails userDetails) {
    final String email = extractEmail(token);
    return email.equals(userDetails.getUsername()) && !isTokenExpired(token);
  }

  private boolean isTokenExpired(String token) {
    return getClaims(token).getExpiration().before(new Date());
  }

  /**
   * Extracts claims from a JWT token.
   */
  private Claims getClaims(String token) {
    return Jwts.parserBuilder()
        .setSigningKey(getKey())
        .build()
        .parseClaimsJws(token)
        .getBody();
  }

  /**
   * Gets the signing key for JWT operations.
   */
  private Key getKey() {
    return Keys.hmacShaKeyFor(
        secret.getBytes(StandardCharsets.UTF_8));
  }
}
