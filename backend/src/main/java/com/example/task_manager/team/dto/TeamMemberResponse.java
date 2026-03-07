package com.example.task_manager.team.dto;

import java.time.LocalDateTime;
import java.util.UUID;

import com.example.task_manager.team.entity.TeamRole;

/**
 * DTO for returning team member information.
 */
public record TeamMemberResponse(
    UUID userId,
    String firstName,
    String lastName,
    String email,
    TeamRole role,
    LocalDateTime joinedAt) {
}
