package com.example.task_manager.task.dto;

import java.time.Instant;

import com.example.task_manager.task.entity.TaskPriority;

import jakarta.validation.constraints.Size;

/**
 * DTO for updating an existing task.
 */
public record UpdateTaskDetailsRequest(
    @Size(max = 100) String title,

    @Size(max = 500) String description,

    TaskPriority priority,

    Instant plannedStartDate,

    Instant plannedDueDate) {
}
