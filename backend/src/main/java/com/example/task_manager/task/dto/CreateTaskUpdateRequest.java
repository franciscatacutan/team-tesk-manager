package com.example.task_manager.task.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * DTO for creating a task update.
 */
public record CreateTaskUpdateRequest(
    @NotBlank @Size(max = 300) String message) {
}
