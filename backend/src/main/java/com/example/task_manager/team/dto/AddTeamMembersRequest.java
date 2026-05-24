package com.example.task_manager.team.dto;

import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;

/**
 * DTO for adding members to a team.
 */
public record AddTeamMembersRequest(
    @NotEmpty List<@Valid TeamMemberRequest> members) {
}
