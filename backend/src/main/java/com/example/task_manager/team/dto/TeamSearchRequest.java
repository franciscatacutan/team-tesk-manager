package com.example.task_manager.team.dto;

import java.util.UUID;

/*
* DTO for fetching teams with search, filtering and sort
*/
public record TeamSearchRequest(
    String search,
    UUID ownerId,
    UUID memberId,
    Boolean includeDeleted,
    Boolean onlyDeleted

) {
}