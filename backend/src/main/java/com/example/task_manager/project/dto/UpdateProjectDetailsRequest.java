package com.example.task_manager.project.dto;

import jakarta.validation.constraints.Size;

/**
 * DTO for updating an existing project.
 */
public record UpdateProjectDetailsRequest(
    @Size(max = 100) String name,
    @Size(max = 500) String description) {

}
