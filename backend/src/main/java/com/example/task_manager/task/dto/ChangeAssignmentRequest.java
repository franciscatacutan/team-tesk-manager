package com.example.task_manager.task.dto;

import java.util.UUID;

import jakarta.validation.constraints.NotNull;

/**
 * DTO for changing user assignment of a task.
 */
public record ChangeAssignmentRequest(
    @NotNull UUID assigneeId,
    UUID supportId) {
}
