package com.example.task_manager.project.dto;

import java.time.Instant;

/**
 * DTO for returning project information.
 */
public record ProjectResponse(
    Long id,
    String name,
    String description,
    Instant createdAt,
    Instant updatedAt) {
}
