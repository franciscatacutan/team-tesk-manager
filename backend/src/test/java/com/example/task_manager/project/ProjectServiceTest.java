package com.example.task_manager.project;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.example.task_manager.exception.api.UnauthorizedException;
import com.example.task_manager.project.entity.ProjectEntity;
import com.example.task_manager.user.entity.UserEntity;

/**
 * Unit tests for ProjectService.
 */
@ExtendWith(MockitoExtension.class)
class ProjectServiceTest {

    // Mocked dependencies
    @Mock
    private ProjectRepository projectRepository;

    @InjectMocks
    private ProjectService projectService;

    /**
     * Tests successful project deletion by the owner.
     */
    @Test
    void shouldDeleteProjectSuccessfully() {

        Long projectId = 10L;
        String userEmail = "owner@test.com";

        // Owner
        UserEntity owner = new UserEntity();
        owner.setEmail(userEmail);

        // Project
        ProjectEntity project = new ProjectEntity();
        project.setId(projectId);
        project.setOwner(owner);

        when(projectRepository.findById(projectId))
                .thenReturn(Optional.of(project));

        projectService.delete(projectId, userEmail);

        // Assert that delete was called
        verify(projectRepository).delete(project);
    }

    /**
     * Tests unauthorized project deletion attempt by a non-owner.
     */
    @Test
    void shouldThrowUnauthorizedWhenNotOwner() {

        Long projectId = 10L;

        // Other user trying to delete the project
        UserEntity owner = new UserEntity();
        owner.setEmail("owner@test.com");

        ProjectEntity project = new ProjectEntity();
        project.setOwner(owner);

        when(projectRepository.findById(projectId))
                .thenReturn(Optional.of(project));

        // Assert that UnauthorizedException is thrown
        assertThrows(
                UnauthorizedException.class,
                () -> projectService.delete(projectId, "hacker@test.com"));
    }

}