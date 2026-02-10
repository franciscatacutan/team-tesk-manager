package com.example.task_manager.task.dto;

import java.time.Instant;
import java.util.UUID;

import com.example.task_manager.task.entity.TaskStatus;

/**
 * DTO for task response.
 */
public record TaskResponse(
    UUID id,
    String title,
    String description,
    TaskStatus status,
    TaskUser assignedUser,
    Instant createdAt,
    Instant updatedAt) {

  /**
   * DTO for user assigned to task.
   */
  public record TaskUser(
      UUID id,
      String firstName,
      String lastName,
      String email) {
  }
}
