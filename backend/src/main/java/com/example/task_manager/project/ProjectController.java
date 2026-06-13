package com.example.task_manager.project;

import java.util.UUID;

import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.example.task_manager.common.PageResponse;
import com.example.task_manager.project.dto.ChangeProjectStatusRequest;
import com.example.task_manager.project.dto.CreateProjectRequest;
import com.example.task_manager.project.dto.ProjectActivityResponse;
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

  @PostMapping
  public ResponseEntity<ProjectResponse> createProject(
      @PathVariable UUID teamId,
      @Valid @RequestBody CreateProjectRequest request,
      Authentication authentication) {

    return ResponseEntity.status(HttpStatus.CREATED)
        .body(projectService.createProject(teamId, request, authentication.getName()));

  }

  @PatchMapping("/{projectId}")
  public ResponseEntity<ProjectResponse> updateProject(
      @PathVariable UUID teamId,
      @PathVariable UUID projectId,
      @Valid @RequestBody UpdateProjectDetailsRequest request,
      Authentication authentication) {

    return ResponseEntity.ok(projectService.updateProject(teamId, projectId, request, authentication.getName()));
  }

  @DeleteMapping("/{projectId}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public ResponseEntity<Void> deleteProject(
      @PathVariable UUID teamId,
      @PathVariable UUID projectId,
      Authentication authentication) {

    projectService.deleteProject(teamId, projectId, authentication.getName());

    return ResponseEntity.noContent().build();
  }

  @GetMapping
  public ResponseEntity<PageResponse<ProjectResponse>> getProjects(
      @PathVariable UUID teamId,
      @ModelAttribute ProjectSearchRequest request,
      @PageableDefault(page = 0, size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable,
      Authentication authentication) {

    return ResponseEntity.ok(projectService.getProjects(teamId, request, pageable, authentication));
  }

  @GetMapping("/{projectId}")
  public ResponseEntity<ProjectResponse> getProjectById(
      @PathVariable UUID teamId,
      @PathVariable UUID projectId,
      Authentication authentication) {
    return ResponseEntity.ok(projectService.getProjectById(teamId, projectId, authentication));
  }

  @GetMapping("/{projectId}/activities")
  public ResponseEntity<PageResponse<ProjectActivityResponse>> getProjectActivities(
      @PathVariable UUID teamId,
      @PathVariable UUID projectId,
      @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable,
      Authentication authentication) {
    return ResponseEntity.ok(projectService.getProjectActivities(teamId, projectId, pageable, authentication));
  }

  @PatchMapping("/{projectId}/status")
  public ResponseEntity<ProjectResponse> changeStatus(
      @PathVariable UUID teamId,
      @PathVariable UUID projectId,
      @Valid @RequestBody ChangeProjectStatusRequest request,
      Authentication authentication) {
    return ResponseEntity.ok(projectService.changeProjectStatus(teamId, projectId, request, authentication.getName()));
  }
}
