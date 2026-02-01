package com.example.task_manager.task;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.task_manager.exception.api.ResourceNotFoundException;
import com.example.task_manager.exception.api.UnauthorizedException;
import com.example.task_manager.project.ProjectEntity;
import com.example.task_manager.project.ProjectRepo;
import com.example.task_manager.task.dto.CreateTaskRequest;
import com.example.task_manager.task.dto.TaskResponse;
import com.example.task_manager.task.dto.UpdateTaskRequest;
import com.example.task_manager.task.dto.UpdateTaskStatusRequest;
import com.example.task_manager.user.UserEntity;
import com.example.task_manager.user.UserRepo;

import lombok.RequiredArgsConstructor;

/**
 * Handles business logic for tasks.
 */
@Service
@RequiredArgsConstructor
public class TaskService {

  @Autowired
  private final TaskRepo taskRepository;
  @Autowired
  private final ProjectRepo projectRepository;
  @Autowired
  private final UserRepo userRepository;

  /**
   * Creates task under project and optionally assigns user.
   */
  public TaskResponse create(
      Long projectId,
      CreateTaskRequest request,
      String userEmail) {

    ProjectEntity project = getOwnedProject(projectId, userEmail);

    UserEntity assignee = resolveAssignee(request.assignedUserId());

    TaskEntity task = new TaskEntity();
    task.setTitle(request.title());
    task.setDescription(request.description());
    task.setStatus(
        // default to TODO if no status provided
        // default to TODO if not assigned to user
        request.assignedUserId() != null && request.status() != null ? request.status() : TaskStatus.TODO);
    task.setProject(project);
    task.setAssignedUser(assignee);

    return mapToResponse(taskRepository.save(task));
  }

  /**
   * Returns all tasks for a project.
   * Owner only.
   */
  public List<TaskResponse> getByProject(
      Long projectId,
      String userEmail) {

    ProjectEntity project = getOwnedProject(projectId, userEmail);

    return taskRepository
        .findByProjectId(project.getId())
        .stream()
        .map(this::mapToResponse)
        .toList();
  }

  /**
   * Updates task and assignment.
   */
  public TaskResponse update(
      Long taskId,
      UpdateTaskRequest request,
      String userEmail) {

    TaskEntity task = getOwnedTask(taskId, userEmail);
    if (request.title() != null) {
      task.setTitle(request.title());
    }

    if (request.description() != null) {
      task.setDescription(request.description());
    }

    if (request.status() != null) {
      task.setStatus(request.status());
    }

    if (request.assignedUserId() != null) {
      task.setAssignedUser(
          resolveAssignee(request.assignedUserId()));
    }

    return mapToResponse(taskRepository.save(task));
  }

  /**
   * Updates task status.
   * Allowed for project owner OR assigned user.
   */
  public TaskResponse updateStatus(
      Long taskId,
      UpdateTaskStatusRequest request,
      String userEmail) {

    TaskEntity task = taskRepository.findById(taskId)
        .orElseThrow(() -> new ResourceNotFoundException("Task not found"));

    boolean isOwner = task.getProject()
        .getOwner()
        .getEmail()
        .equals(userEmail);

    boolean isAssignee = task.getAssignedUser() != null &&
        task.getAssignedUser()
            .getEmail()
            .equals(userEmail);

    if (!isOwner && !isAssignee) {
      throw new UnauthorizedException();
    }

    task.setStatus(request.status());

    return mapToResponse(taskRepository.save(task));
  }

  /**
   * Deletes task.
   * Owner only.
   */
  public void delete(
      Long taskId,
      String userEmail) {

    TaskEntity task = getOwnedTask(taskId, userEmail);
    taskRepository.delete(task);
  }

  // HELPERS

  /**
   * Resolves assignee by ID or returns null if ID is null.
   */
  private UserEntity resolveAssignee(Long assigneeId) {

    if (assigneeId == null) {
      return null;
    }

    return userRepository.findById(assigneeId)
        .orElseThrow(() -> new ResourceNotFoundException("Assignee not found"));
  }

  /**
   * Ensures task exists and belongs to project owned by user.
   */
  private TaskEntity getOwnedTask(
      Long taskId,
      String userEmail) {

    TaskEntity task = taskRepository.findById(taskId)
        .orElseThrow(() -> new ResourceNotFoundException("Task not found"));

    if (!task.getProject()
        .getOwner()
        .getEmail()
        .equals(userEmail)) {

      throw new UnauthorizedException();
    }

    return task;
  }

  /**
   * Ensures project exists and belongs to user.
   */
  private ProjectEntity getOwnedProject(
      Long projectId,
      String userEmail) {

    ProjectEntity project = projectRepository.findById(projectId)
        .orElseThrow(() -> new ResourceNotFoundException("Project not found"));

    if (!project.getOwner()
        .getEmail()
        .equals(userEmail)) {

      throw new UnauthorizedException();
    }

    return project;
  }

  /**
   * Maps TaskEntity to TaskResponse.
   */
  private TaskResponse mapToResponse(TaskEntity task) {
    TaskResponse.TaskUser assignedTo = null;

    if (task.getAssignedUser() != null) {
      assignedTo = new TaskResponse.TaskUser(task.getAssignedUser().getId(),
          task.getAssignedUser().getFirstName(),
          task.getAssignedUser().getLastName(),
          task.getAssignedUser().getEmail());
    }

    return new TaskResponse(
        task.getId(),
        task.getTitle(),
        task.getDescription(),
        task.getStatus(),
        assignedTo,
        task.getCreatedAt(),
        task.getUpdatedAt());
  }
}
