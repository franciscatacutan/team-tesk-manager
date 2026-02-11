package com.example.task_manager.project.dto;

import java.time.Instant;
import java.util.UUID;

/**
 * DTO for returning project information.
 */
public record ProjectResponse(
		UUID id,
		String name,
		String description,
		ProjectOwner owner,
		Instant createdAt,
		Instant updatedAt) {

	/**
	 * DTO for project owner information.
	 */
	public record ProjectOwner(
			UUID id,
			String firstName,
			String lastName,
			String email) {
	}

}
