package com.example.task_manager.task;

import java.security.Principal;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.task_manager.task.dto.CreateTaskRequest;
import com.example.task_manager.task.dto.TaskResponse;
import com.example.task_manager.task.dto.UpdateTaskRequest;
import com.example.task_manager.task.dto.UpdateTaskStatusRequest;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

/**
 * REST controller for managing tasks within projects.
 */
@RestController
@RequestMapping("/api/projects/{projectId}/tasks")
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;

    /**
     * Create a new task within a project.
     * Owner only.
     */
    @PostMapping
    public ResponseEntity<TaskResponse> createTask(
            @PathVariable Long projectId,
            @Valid @RequestBody CreateTaskRequest request,
            Principal principal) {

        return ResponseEntity.status(
                HttpStatus.CREATED.value())
                .body(taskService.create(
                        projectId,
                        request,
                        principal.getName()));
    }

    /**
     * Get all tasks for a project.
     * Owner only.
     */
    @GetMapping
    public ResponseEntity<List<TaskResponse>> getProjectTasks(
            @PathVariable Long projectId,
            Principal principal) {

        return ResponseEntity.ok(
                taskService.getByProject(
                        projectId,
                        principal.getName()));
    }

    /**
     * Update task details (title, description, assignee).
     * Owner only.
     */
    @PatchMapping("/{taskId}")
    public ResponseEntity<TaskResponse> updateTask(
            @PathVariable Long projectId,
            @PathVariable Long taskId,
            @Valid @RequestBody UpdateTaskRequest request,
            Principal principal) {

        return ResponseEntity.ok(
                taskService.update(
                        taskId,
                        request,
                        principal.getName()));
    }

    /**
     * Update task status.
     * Allowed for project owner OR assigned user.
     */
    @PatchMapping("/{taskId}/status")
    public ResponseEntity<TaskResponse> updateTaskStatus(
            @PathVariable Long taskId,
            @RequestBody UpdateTaskStatusRequest request,
            Principal principal) {

        return ResponseEntity.ok(
                taskService.updateStatus(
                        taskId,
                        request,
                        principal.getName()));
    }

    /**
     * Delete a task.
     * Owner only.
     */
    @DeleteMapping("/{taskId}")
    public ResponseEntity<Void> deleteTask(
            @PathVariable Long projectId,
            @PathVariable Long taskId,
            Principal principal) {

        taskService.delete(
                taskId,
                principal.getName());

        return ResponseEntity.noContent().build();
    }
}
