package com.example.task_manager.project;

import java.security.Principal;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import com.example.task_manager.project.dto.CreateProjectRequest;
import com.example.task_manager.project.dto.ProjectResponse;
import com.example.task_manager.project.dto.UpdateProjectRequest;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

/**
 * REST controller for managing projects.
 */
@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
public class ProjectController {

  private final ProjectService projectService;

  /**
   * Create new project.
   */
  @PostMapping
  public ResponseEntity<ProjectResponse> create(
      @Valid @RequestBody CreateProjectRequest request,
      Principal principal) {

    return ResponseEntity.status(HttpStatus.CREATED)
        .body(projectService.create(request, principal.getName()));

  }

  /**
   * Get all projects for authenticated user.
   */
  @GetMapping
  public ResponseEntity<List<ProjectResponse>> getUserProjects(
      Principal principal) {
    return ResponseEntity.ok(projectService.getUserProjects(principal.getName()));
  }

  /**
   * Update project.
   */
  @PatchMapping("/{id}")
  public ResponseEntity<ProjectResponse> update(
      @PathVariable Long id,
      @Valid @RequestBody UpdateProjectRequest request,
      Principal principal) {

    return ResponseEntity.ok(projectService.update(id, request, principal.getName()));
  }

  /**
   * Delete project.
   */
  @DeleteMapping("/{id}")
  public ResponseEntity<Void> delete(@PathVariable Long id, Principal principal) {

    projectService.delete(id, principal.getName());
    return ResponseEntity.noContent().build();
  }
}
