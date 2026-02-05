package com.example.task_manager.team;

import com.fasterxml.jackson.annotation.JsonCreator;

/**
 * Enum representing a members role to a team.
 */
public enum TeamRole {
  OWNER,
  ADMIN,
  MEMBER;

  // Converts a string to a TaskStatus enum, ignoring case
  @JsonCreator
  public static TeamRole from(String value) {
    return TeamRole.valueOf(value.toUpperCase());
  }
}
