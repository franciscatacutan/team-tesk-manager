package com.example.task_manager.team.dto;

import java.util.List;
import java.util.UUID;

import jakarta.validation.constraints.NotEmpty;

/**
 * DTO for removing members of a team.
 */
public record RemoveTeamMembersRequest(
    @NotEmpty List<UUID> userIds) {
}
