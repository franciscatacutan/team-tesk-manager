package com.example.task_manager.team.dto;

import java.time.Instant;
import java.util.UUID;

/**
 * DTO for returning team and owner information.
 */
public record TeamResponse(
    UUID id,
    String name,
    String description,
    User owner,
    Instant createdAt,
    Instant updatedAt,
    Boolean isDeleted) {

  // Owner Info
  public record User(
      UUID userId,
      String firstName,
      String lastName,
      String email) {
  }
}
