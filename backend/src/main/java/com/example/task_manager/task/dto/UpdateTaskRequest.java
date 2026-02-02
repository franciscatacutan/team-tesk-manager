package com.example.task_manager.task.dto;

import com.example.task_manager.task.TaskStatus;

/**
 * DTO for updating an existing task.
 */
public record UpdateTaskRequest(
        String title,
        String description,
        TaskStatus status,
        Long assignedUserId) {

}
