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
import com.example.task_manager.task.dto.CreateTaskCommentRequest;
import com.example.task_manager.task.dto.TaskResponse;
import com.example.task_manager.task.dto.TaskSearchRequest;
import com.example.task_manager.task.dto.TaskActivityResponse;
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

  @PostMapping
  public ResponseEntity<TaskResponse> createTask(
      @PathVariable UUID teamId,
      @PathVariable UUID projectId,
      @Valid @RequestBody CreateTaskRequest request,
      Authentication authentication) {

    return ResponseEntity.status(HttpStatus.CREATED.value())
        .body(taskService.createTask(teamId, projectId, request, authentication.getName()));
  }

  @PatchMapping("/{taskId}")
  public ResponseEntity<TaskResponse> updateTask(
      @PathVariable UUID teamId,
      @PathVariable UUID projectId,
      @PathVariable UUID taskId,
      @Valid @RequestBody UpdateTaskDetailsRequest request,
      Authentication authentication) {

    return ResponseEntity.ok(taskService.updateTask(teamId, projectId, taskId, request, authentication.getName()));
  }

  @DeleteMapping("/{taskId}")
  public ResponseEntity<Void> deleteTask(
      @PathVariable UUID teamId,
      @PathVariable UUID projectId,
      @PathVariable UUID taskId,
      Authentication authentication) {

    taskService.deleteTask(teamId, projectId, taskId, authentication.getName());

    return ResponseEntity.noContent().build();
  }

  @GetMapping()
  public ResponseEntity<PageResponse<TaskResponse>> getTasks(
      @PathVariable UUID teamId,
      @PathVariable UUID projectId,
      TaskSearchRequest request,
      @PageableDefault(page = 0, size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable,
      Authentication authentication) {

    return ResponseEntity.ok(taskService.getTasks(teamId, projectId, request, pageable, authentication));
  }

  @GetMapping("/{taskId}/existing")
  public ResponseEntity<TaskResponse> getTaskById(
      @PathVariable UUID teamId,
      @PathVariable UUID projectId,
      @PathVariable UUID taskId,
      Authentication authentication) {

    return ResponseEntity.ok(taskService.getTaskById(teamId, projectId, taskId, authentication));
  }

  @GetMapping("/my-task")
  public ResponseEntity<PageResponse<TaskResponse>> getMyTasks(
      @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable,
      Authentication authentication) {

    PageResponse<TaskResponse> response = taskService.getMyTasks(authentication.getName(), pageable);

    return ResponseEntity.ok(response);
  }

  @GetMapping("/project-task")
  public ResponseEntity<PageResponse<TaskResponse>> getMyTasksByProject(
      @PathVariable UUID projectId,
      @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable,
      Authentication authentication) {

    PageResponse<TaskResponse> response = taskService.getMyTasksByProject(projectId, authentication.getName(),
        pageable);

    return ResponseEntity.ok(response);
  }

  @GetMapping("/{taskId}/activities")
  public ResponseEntity<PageResponse<TaskActivityResponse>> getTaskActivities(
      @PathVariable UUID teamId,
      @PathVariable UUID projectId,
      @PathVariable UUID taskId,
      @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable,
      Authentication authentication) {

    return ResponseEntity.ok(taskService.getTaskActivities(teamId, projectId, taskId, pageable, authentication));
  }

  @PatchMapping("/{taskId}/status")
  public ResponseEntity<TaskResponse> changeStatus(
      @PathVariable UUID teamId,
      @PathVariable UUID projectId,
      @PathVariable UUID taskId,
      @Valid @RequestBody ChangeStatusRequest request,
      Authentication authentication) {

    return ResponseEntity.ok(taskService.changeStatus(teamId, projectId, taskId, request, authentication.getName()));
  }

  @PatchMapping("/{taskId}/assignee/{userId}")
  public ResponseEntity<TaskResponse> changeAssignee(
      @PathVariable UUID teamId,
      @PathVariable UUID projectId,
      @PathVariable UUID taskId,
      @PathVariable UUID userId,
      Authentication authentication) {

    return ResponseEntity.ok(taskService.changeAssignee(teamId, projectId, taskId, userId, authentication.getName()));
  }

  @PatchMapping("/{taskId}/support/{userId}")
  public ResponseEntity<TaskResponse> changeSupport(
      @PathVariable UUID teamId,
      @PathVariable UUID projectId,
      @PathVariable UUID taskId,
      @PathVariable UUID userId,
      Authentication authentication) {

    return ResponseEntity.ok(taskService.changeSupport(teamId, projectId, taskId, userId, authentication.getName()));
  }

  @PostMapping("/{taskId}/activities")
  public ResponseEntity<TaskActivityResponse> addTaskComment(
      @PathVariable UUID teamId,
      @PathVariable UUID projectId,
      @PathVariable UUID taskId,
      @Valid @RequestBody CreateTaskCommentRequest request,
      Authentication authentication) {

    return ResponseEntity.ok(taskService.addTaskComment(teamId, projectId, taskId, request, authentication.getName()));
  }

}
