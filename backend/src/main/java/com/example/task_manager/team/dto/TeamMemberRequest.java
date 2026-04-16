package com.example.task_manager.team.dto;

import java.util.UUID;

import com.example.task_manager.team.entity.TeamRole;

import jakarta.validation.constraints.NotNull;

/**
 * DTO for adding member of a team.
 */
public record TeamMemberRequest(
    @NotNull UUID userId,
    TeamRole role) {

}
