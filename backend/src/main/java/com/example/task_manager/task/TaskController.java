package com.example.task_manager.task;

import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.task_manager.common.PageResponse;
import com.example.task_manager.task.dto.ChangeStatusRequest;
import com.example.task_manager.task.dto.CreateTaskRequest;
import com.example.task_manager.task.dto.CreateTaskUpdateRequest;
import com.example.task_manager.task.dto.TaskResponse;
import com.example.task_manager.task.dto.TaskSearchRequest;
import com.example.task_manager.task.dto.TaskUpdateResponse;
import com.example.task_manager.task.dto.UpdateTaskDetailsRequest;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

/**
 * REST controller for managing tasks within projects.
 */
@RestController
@RequestMapping("/api/teams/{teamId}/projects/{projectId}/tasks")
@RequiredArgsConstructor
public class TaskController {

  private final TaskService taskService;

  /**
   * Create a new task within a project.
   * Owner only.
   */
  @PostMapping
  public ResponseEntity<TaskResponse> createTask(
      @PathVariable UUID teamId,
      @PathVariable UUID projectId,
      @Valid @RequestBody CreateTaskRequest request,
      Authentication authentication) {

    return ResponseEntity.status(HttpStatus.CREATED.value())
        .body(taskService.createTask(teamId, projectId, request, authentication.getName()));
  }

  /**
   * Update task details (title, description, assignee).
   * Owner only.
   */
  @PatchMapping("/{taskId}")
  public ResponseEntity<TaskResponse> updateTask(
      @PathVariable UUID teamId,
      @PathVariable UUID projectId,
      @PathVariable UUID taskId,
      @Valid @RequestBody UpdateTaskDetailsRequest request,
      Authentication authentication) {

    return ResponseEntity.ok(taskService.updateTask(teamId, projectId, taskId, request, authentication.getName()));
  }

  /**
   * Delete a task.
   * Owner only.
   */
  @DeleteMapping("/{taskId}")
  public ResponseEntity<Void> deleteTask(
      @PathVariable UUID teamId,
      @PathVariable UUID projectId,
      @PathVariable UUID taskId,
      Authentication authentication) {

    taskService.deleteTask(teamId, projectId, taskId, authentication.getName());

    return ResponseEntity.noContent().build();
  }

  /**
   * Change Status of a Task
   */
  @PatchMapping("/{taskId}/status")
  public ResponseEntity<TaskResponse> changeStatus(
      @PathVariable UUID teamId,
      @PathVariable UUID projectId,
      @PathVariable UUID taskId,
      @Valid @RequestBody ChangeStatusRequest request,
      Authentication authentication) {

    return ResponseEntity.ok(taskService.changeStatus(teamId, projectId, taskId, request, authentication.getName()));
  }

  /**
   * Change Assignee of a Task
   */
  @PatchMapping("/{taskId}/assignee/{userId}")
  public ResponseEntity<TaskResponse> changeAssignee(
      @PathVariable UUID teamId,
      @PathVariable UUID projectId,
      @PathVariable UUID taskId,
      @PathVariable UUID userId,
      Authentication authentication) {

    return ResponseEntity.ok(taskService.changeAssignee(teamId, projectId, taskId, userId, authentication.getName()));
  }

  /**
   * Change Support of a Task
   */
  @PatchMapping("/{taskId}/support/{userId}")
  public ResponseEntity<TaskResponse> changeSupport(
      @PathVariable UUID teamId,
      @PathVariable UUID projectId,
      @PathVariable UUID taskId,
      @PathVariable UUID userId,
      Authentication authentication) {

    return ResponseEntity.ok(taskService.changeSupport(teamId, projectId, taskId, userId, authentication.getName()));
  }

  /**
   * Add an update for a Task
   */
  @PostMapping("/{taskId}/updates")
  public ResponseEntity<TaskUpdateResponse> addTaskUpdate(
      @PathVariable UUID teamId,
      @PathVariable UUID projectId,
      @PathVariable UUID taskId,
      @Valid @RequestBody CreateTaskUpdateRequest request,
      Authentication authentication) {

    return ResponseEntity.ok(taskService.addTaskUpdate(teamId, projectId, taskId, request, authentication.getName()));
  }

  /**
   * Get an Existing task by Id
   */
  @GetMapping("/{taskId}/existing")
  public ResponseEntity<TaskResponse> getExistingTaskById(
      @PathVariable UUID teamId,
      @PathVariable UUID projectId,
      @PathVariable UUID taskId,
      Authentication authentication) {

    return ResponseEntity.ok(taskService.getExistingTaskById(teamId, projectId, taskId, authentication.getName()));
  }

  /**
   * Get an Active task by Id
   */
  @GetMapping("/{taskId}")
  public ResponseEntity<TaskResponse> getActiveTaskById(
      @PathVariable UUID teamId,
      @PathVariable UUID projectId,
      @PathVariable UUID taskId,
      Authentication authentication) {

    return ResponseEntity.ok(taskService.getActiveTaskById(teamId, projectId, taskId, authentication.getName()));
  }

  /**
   * Retrieves task for a project and team with support for:
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
  @GetMapping()
  public ResponseEntity<PageResponse<TaskResponse>> getTasks(
      @PathVariable UUID teamId,
      @PathVariable UUID projectId,
      TaskSearchRequest request,
      @PageableDefault(page = 0, size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable,
      Authentication authentication) {

    return ResponseEntity.ok(taskService.getTasks(teamId, projectId, request, pageable, authentication));
  }

  /**
   * Get all authenticated user's assignments.
   */
  @GetMapping("/my-task")
  public ResponseEntity<PageResponse<TaskResponse>> getMyTasks(
      @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable,
      Authentication authentication) {

    PageResponse<TaskResponse> response = taskService.getMyTasks(authentication.getName(), pageable);

    return ResponseEntity.ok(response);
  }

  /**
   * Get all updates for an Active Task
   */
  @GetMapping("/{taskId}/updates")
  public ResponseEntity<PageResponse<TaskUpdateResponse>> getAllActiveTaskUpdates(
      @PathVariable UUID teamId,
      @PathVariable UUID taskId,
      @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable,
      Authentication authentication) {

    return ResponseEntity.ok(taskService.getAllActiveTaskUpdates(teamId, taskId, pageable, authentication.getName()));
  }

  /**
   * Get all updates for an Existing Task
   */
  @GetMapping("/{taskId}/updates-all")
  public ResponseEntity<PageResponse<TaskUpdateResponse>> getAllExistingTaskUpdates(
      @PathVariable UUID teamId,
      @PathVariable UUID taskId,
      @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable,
      Authentication authentication) {

    return ResponseEntity.ok(taskService.getAllExistingTaskUpdates(teamId, taskId, pageable, authentication.getName()));
  }
}
