package com.example.task_manager.project.dto;

import jakarta.validation.constraints.NotBlank;

/**
 * DTO for creating a new project.
 */
public record CreateProjectRequest(
    @NotBlank String name,
    String description) {
}
