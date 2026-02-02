package com.example.task_manager.project.dto;

import java.time.Instant;

/**
 * DTO for returning project information.
 */
public record ProjectResponse(
        Long id,
        String name,
        String description,
        ProjectOwner owner,
        Instant createdAt,
        Instant updatedAt) {

    /**
     * DTO for project owner information.
     */
    public record ProjectOwner(
            Long id,
            String firstName,
            String lastName,
            String email) {
    }

}
