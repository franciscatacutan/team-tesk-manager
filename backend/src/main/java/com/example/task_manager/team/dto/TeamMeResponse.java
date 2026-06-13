package com.example.task_manager.team.dto;

import java.util.UUID;

import com.example.task_manager.team.entity.TeamRole;

/**
 * DTO for returning User's team role.
 */
public record TeamMeResponse(
    UUID userId,
    TeamRole role) {
}