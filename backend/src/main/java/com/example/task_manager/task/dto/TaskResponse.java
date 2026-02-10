package com.example.task_manager.task.dto;

import java.time.Instant;

import com.example.task_manager.task.entity.TaskStatus;

/**
 * DTO for task response.
 */
public record TaskResponse(
    Long id,
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
      Long id,
      String firstName,
      String lastName,
      String email) {
  }
}
