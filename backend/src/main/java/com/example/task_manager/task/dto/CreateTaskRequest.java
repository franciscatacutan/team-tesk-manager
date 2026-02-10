package com.example.task_manager.task.dto;

import com.example.task_manager.task.entity.TaskStatus;

import jakarta.validation.constraints.NotBlank;

/**
 * DTO for creating a new task.
 */
public record CreateTaskRequest(
        @NotBlank String title,
        String description,
        TaskStatus status,
        Long assignedUserId) {
}
