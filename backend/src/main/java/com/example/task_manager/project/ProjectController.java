package com.example.task_manager.project;

import java.util.UUID;

import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.data.domain.Sort;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import com.example.task_manager.common.PageResponse;
import com.example.task_manager.project.dto.ChangeProjectStatusRequest;
import com.example.task_manager.project.dto.CreateProjectRequest;
import com.example.task_manager.project.dto.ProjectResponse;
import com.example.task_manager.project.dto.ProjectSearchRequest;
import com.example.task_manager.project.dto.UpdateProjectDetailsRequest;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

/**
 * REST controller for managing projects.
 */
@RestController
@RequestMapping("/api/teams/{teamId}/projects")
@RequiredArgsConstructor
public class ProjectController {

  private final ProjectService projectService;

  /**
   * Create new project.
   */
  @PostMapping
  public ResponseEntity<ProjectResponse> createProject(
      @PathVariable UUID teamId,
      @Valid @RequestBody CreateProjectRequest request,
      Authentication authentication) {

    return ResponseEntity.status(HttpStatus.CREATED)
        .body(projectService.createProject(teamId, request, authentication.getName()));

  }

  /**
   * Update project.
   */
  @PatchMapping("/{projectId}")
  public ResponseEntity<ProjectResponse> updateProject(
      @PathVariable UUID teamId,
      @PathVariable UUID projectId,
      @Valid @RequestBody UpdateProjectDetailsRequest request,
      Authentication authentication) {

    return ResponseEntity.ok(projectService.updateProject(teamId, projectId, request, authentication.getName()));
  }

  /**
   * Delete project.
   */
  @DeleteMapping("/{projectId}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public ResponseEntity<Void> deleteProject(
      @PathVariable UUID teamId,
      @PathVariable UUID projectId,
      Authentication authentication) {

    projectService.deleteProject(teamId, projectId, authentication.getName());

    return ResponseEntity.noContent().build();
  }

  /**
   * Retrieves projects for a team with support for:
   * - Search
   * - Filtering
   * - Sorting
   * - Pagination
   * - Role-based soft-delete visibility
   *
   * Default behavior:
   * - Returns only active (non-deleted) projects.
   *
   * Global Admins users may include deleted records using:
   * ?includeDeleted=true
   */
  @GetMapping
  public PageResponse<ProjectResponse> getProjects(
      @PathVariable UUID teamId,
      ProjectSearchRequest request,
      @PageableDefault(page = 0, size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable,
      Authentication authentication) {

    return projectService.getProjects(teamId, request, pageable, authentication);
  }

  /**
   * Get project by ID.
   */
  @GetMapping("/{projectId}")
  public ResponseEntity<ProjectResponse> getActiveProjectById(
      @PathVariable UUID teamId,
      @PathVariable UUID projectId,
      Authentication authentication) {
    return ResponseEntity.ok(projectService.getActiveProjectById(teamId, projectId, authentication.getName()));
  }

  /**
   * Get project by ID.
   */
  @GetMapping("/{projectId}/existing")
  public ResponseEntity<ProjectResponse> getExistingProjectById(
      @PathVariable UUID teamId,
      @PathVariable UUID projectId,
      Authentication authentication) {
    return ResponseEntity.ok(projectService.getExistingProjectById(teamId, projectId, authentication.getName()));
  }

  /**
   * Change project's status
   */
  @PatchMapping("/{projectId}/status")
  public ResponseEntity<ProjectResponse> changeStatus(
      @PathVariable UUID teamId,
      @PathVariable UUID projectId,
      @Valid @RequestBody ChangeProjectStatusRequest request,
      Authentication authentication) {
    return ResponseEntity.ok(projectService.changeProjectStatus(teamId, projectId, request, authentication.getName()));
  }
}
