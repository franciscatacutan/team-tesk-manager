package com.example.task_manager.task.dto;

import java.time.Instant;
import java.util.UUID;

import com.example.task_manager.task.entity.TaskPriority;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

/**
 * DTO for creating a new task.
 */
public record CreateTaskRequest(

    @NotBlank @Size(max = 100) String title,

    @Size(max = 500) String description,

    @NotNull TaskPriority priority,

    @NotNull Instant plannedStartDate,

    @NotNull Instant plannedDueDate,

    @NotNull UUID assigneeId,

    UUID supportId) {
}
