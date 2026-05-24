package com.example.task_manager.team.dto;

import java.time.LocalDateTime;
import java.util.UUID;

import com.example.task_manager.team.entity.TeamRole;
import com.example.task_manager.user.entity.UserRole;

/**
 * DTO for returning team member information.
 */
public record TeamMemberResponse(
    UUID id,
    String firstName,
    String lastName,
    String email,
    TeamRole teamRole,
    UserRole globalRole,
    LocalDateTime joinedAt) {
}
