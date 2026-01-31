package com.example.task_manager.project;

import java.time.Instant;
import java.util.List;

import org.springframework.stereotype.Service;

import com.example.task_manager.exception.api.ResourceNotFoundException;
import com.example.task_manager.exception.api.UnauthorizedException;
import com.example.task_manager.project.dto.CreateProjectRequest;
import com.example.task_manager.project.dto.ProjectResponse;
import com.example.task_manager.project.dto.UpdateProjectRequest;
import com.example.task_manager.user.UserEntity;
import com.example.task_manager.user.UserRepo;

import lombok.RequiredArgsConstructor;

/**
 * Contains business logic for managing projects.
 */
@Service
@RequiredArgsConstructor
public class ProjectService {

  private final ProjectRepo projectRepository;
  private final UserRepo userRepository;

  /**
   * Creates a new project for the authenticated user.
   */
  public ProjectResponse create(
      CreateProjectRequest request,
      String userEmail) {

    UserEntity owner = getUser(userEmail);

    ProjectEntity project = new ProjectEntity();
    project.setName(request.name());
    project.setDescription(request.description());
    project.setOwner(owner);

    return mapToResponse(projectRepository.save(project));
  }

  /**
   * Returns all projects owned by authenticated user.
   */
  public List<ProjectResponse> getUserProjects(String userEmail) {
    UserEntity owner = getUser(userEmail);

    return projectRepository
        .findByOwnerId(owner.getId())
        .stream()
        .map(this::mapToResponse)
        .toList();
  }

  /**
   * Updates an existing project.
   */
  public ProjectResponse update(
      Long projectId,
      UpdateProjectRequest request,
      String userEmail) {

    ProjectEntity project = getOwnedProject(projectId, userEmail);

    project.setName(request.name());
    project.setDescription(request.description());
    project.setUpdatedAt(Instant.now());

    return mapToResponse(projectRepository.save(project));
  }

  /**
   * Deletes a project.
   */
  public void delete(
      Long projectId,
      String userEmail) {

    ProjectEntity project = getOwnedProject(
        projectId,
        userEmail);

    projectRepository.delete(project);
  }

  private UserEntity getUser(String email) {

    return userRepository.findByEmail(email)
        .orElseThrow(() -> new ResourceNotFoundException("User not found"));
  }

  /**
   * Ensures project exists and belongs to user.
   */
  private ProjectEntity getOwnedProject(
      Long projectId,
      String userEmail) {

    ProjectEntity project = projectRepository.findById(projectId)
        .orElseThrow(() -> new ResourceNotFoundException("Project not found for user: " + userEmail));

    if (!project.getOwner()
        .getEmail()
        .equals(userEmail)) {
      throw new UnauthorizedException();
    }

    return project;
  }

  /**
   * Maps a ProjectEntity to a ProjectResponse.
   */
  private ProjectResponse mapToResponse(ProjectEntity project) {
    return new ProjectResponse(
        project.getId(),
        project.getName(),
        project.getDescription(),
        project.getCreatedAt(),
        project.getUpdatedAt());
  }
}