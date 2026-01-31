package com.example.task_manager.project.dto;

import jakarta.validation.constraints.NotBlank;

/**
 * DTO for updating an existing project.
 */
public record UpdateProjectRequest(
        @NotBlank String name,
        String description) {

}
