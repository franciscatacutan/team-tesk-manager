package com.example.task_manager.task.dto;

import java.time.Instant;
import java.util.UUID;

/**
 * DTO for task update response.
 */
public record TaskUpdateResponse(
    UUID id,
    String message,
    UUID createdById,
    String createdByName,
    Instant createdAt) {
}