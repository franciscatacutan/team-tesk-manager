package com.example.task_manager.task;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.example.task_manager.project.ProjectRepository;
import com.example.task_manager.project.entity.ProjectEntity;
import com.example.task_manager.task.dto.CreateTaskRequest;
import com.example.task_manager.task.dto.TaskResponse;
import com.example.task_manager.task.dto.UpdateTaskRequest;
import com.example.task_manager.task.entity.TaskEntity;
import com.example.task_manager.task.entity.TaskStatus;
import com.example.task_manager.user.UserRepository;
import com.example.task_manager.user.entity.UserEntity;

/**
 * Unit tests for TaskService.
 */
@ExtendWith(MockitoExtension.class)
class TaskServiceTest {

    // Mocked dependencies
    @Mock
    private TaskRepository taskRepository;

    @Mock
    private ProjectRepository projectRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private TaskService taskService;

    /**
     * Tests successful task creation.
     */
    @Test
    void shouldCreateTaskSuccessfully() {

        // Test data
        Long projectId = 10L;
        String userEmail = "test@test.com";
        Long assignedUserId = 5L;

        // Assigned user
        UserEntity user = new UserEntity();
        user.setId(assignedUserId);
        user.setEmail(userEmail);

        when(userRepository.findById(assignedUserId))
                .thenReturn(Optional.of(user));

        // Project owned by user
        ProjectEntity project = new ProjectEntity();
        project.setId(projectId);
        project.setOwner(user);

        when(projectRepository.findById(projectId))
                .thenReturn(Optional.of(project));

        CreateTaskRequest request = new CreateTaskRequest(
                "Learn JUnit",
                "Write first unit test",
                TaskStatus.TODO,
                assignedUserId);

        TaskEntity savedTask = new TaskEntity();
        savedTask.setTitle(request.title());
        savedTask.setDescription(request.description());
        savedTask.setStatus(request.status());
        savedTask.setAssignedUser(user);

        when(taskRepository.save(any(TaskEntity.class)))
                .thenReturn(savedTask);

        TaskResponse response = taskService.create(projectId, request, userEmail);

        assertThat(response.title()).isEqualTo("Learn JUnit");
        assertThat(response.description()).isEqualTo("Write first unit test");
        assertThat(response.status()).isEqualTo(TaskStatus.TODO);
        assertThat(response.assignedUser().id()).isEqualTo(5L);

    }

    /**
     * Tests successful task update.
     */
    @Test
    void shouldUpdateTaskSuccessfully() {

        Long taskId = 1L;
        String userEmail = "test@test.com";
        Long assignedUserId = 5L;

        // Assigned user
        UserEntity owner = new UserEntity();
        owner.setEmail(userEmail);

        when(userRepository.findById(assignedUserId))
                .thenReturn(Optional.of(owner));

        // Assigned user
        UserEntity assignee = new UserEntity();
        assignee.setId(assignedUserId);

        when(userRepository.findById(assignedUserId))
                .thenReturn(Optional.of(assignee));

        ProjectEntity project = new ProjectEntity();
        project.setOwner(owner);

        // Existing task
        TaskEntity task = new TaskEntity();
        task.setId(taskId);
        task.setTitle("Old Title");
        task.setDescription("Old Description");
        task.setStatus(TaskStatus.TODO);
        task.setProject(project);
        task.setAssignedUser(assignee);

        when(taskRepository.findById(taskId))
                .thenReturn(Optional.of(task));

        when(taskRepository.save(any(TaskEntity.class)))
                .thenReturn(task);

        UpdateTaskRequest request = new UpdateTaskRequest(
                "Updated Title",
                "Updated Description",
                TaskStatus.DONE,
                assignedUserId);

        TaskResponse response = taskService.update(taskId, request, userEmail);

        // Assert that the response has updated values
        assertThat(response.title()).isEqualTo("Updated Title");
        assertThat(response.description()).isEqualTo("Updated Description");
        assertThat(response.status()).isEqualTo(TaskStatus.DONE);
    }

}