package com.example.task_manager.project.dto;

/**
 * DTO for updating an existing project.
 */
public record UpdateProjectRequest(
    String name,
    String description) {

}
