package com.example.task_manager.auth.dto;

import java.util.UUID;

import com.example.task_manager.user.entity.UserRole;

/**
 * DTO for returning JWT token.
 */
public record AuthResponse(
    String token,
    long expiresInSeconds,
    User user) {
  public record User(
      UUID userId,
      String firstName,
      String lastName,
      String email,
      UserRole role) {

  }
}
