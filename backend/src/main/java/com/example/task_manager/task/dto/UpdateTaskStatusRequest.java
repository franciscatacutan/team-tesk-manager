package com.example.task_manager.task.dto;

import com.example.task_manager.task.TaskStatus;

/**
 * DTO for updating task status.
 */
public record UpdateTaskStatusRequest(
        TaskStatus status) {
}
