package com.example.task_manager.task.dto;

import java.util.UUID;

import com.example.task_manager.task.entity.TaskStatus;

/**
 * DTO for updating an existing task.
 */
public record UpdateTaskRequest(
    String title,
    String description,
    TaskStatus status,
    UUID assignedUserId) {

}
