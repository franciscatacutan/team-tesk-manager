package com.example.task_manager.project.dto;

import java.util.List;
import java.util.UUID;

import com.example.task_manager.project.entity.ProjectStatus;

/*
* DTO for fetching projects with search, filtering and sort
*/
public record ProjectSearchRequest(
    String search,
    List<ProjectStatus> statuses,
    UUID createdBy,
    Boolean includeDeleted,
    Boolean onlyDeleted) {
}
