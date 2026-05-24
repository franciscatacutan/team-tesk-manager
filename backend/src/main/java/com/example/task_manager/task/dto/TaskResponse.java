package com.example.task_manager.task.dto;

import java.time.Instant;
import java.util.UUID;

import com.example.task_manager.task.entity.TaskPriority;
import com.example.task_manager.task.entity.TaskStatus;

/**
 * DTO for task response.
 */
public record TaskResponse(
    UUID id,
    String title,
    String description,
    TaskStatus status,
    TaskPriority priority,
    TaskUser assignedUser,
    TaskUser supportUser,
    Long taskNumber,
    Instant plannedStartDate,
    Instant plannedDueDate,
    Instant actualStartDate,
    Instant actualCompletionDate,
    Instant createdAt,
    Instant updatedAt,
    Instant lastActivityAt) {

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
