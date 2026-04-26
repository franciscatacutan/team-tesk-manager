package com.example.task_manager.project.dto;

import java.time.Instant;
import java.util.UUID;

import com.example.task_manager.project.entity.ProjectStatus;

/**
 * DTO for returning project information.
 */
public record ProjectResponse(
    UUID id,
    String name,
    String description,
    ProjectStatus status,
    UUID teamId,
    ProjectUserSummary createdBy,
    ProjectUserSummary completedBy,
    Instant plannedStartDate,
    Instant plannedDueDate,
    Instant actualStartDate,
    Instant actualCompletionDate,
    Instant createdAt,
    Instant updatedAt,
    Instant lastActivityAt,
    Instant statusChangedAt,
    boolean deleted) {

  /**
   * DTO for project owner information.
   */
  public record ProjectUserSummary(
      UUID id,
      String firstName,
      String lastName,
      String email) {
  }
}
