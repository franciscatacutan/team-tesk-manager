package com.example.task_manager.task;

import java.time.Instant;

import com.example.task_manager.project.ProjectEntity;
import com.example.task_manager.user.UserEntity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

/**
 * Entity representing a task.
 */
@Getter
@Setter
@Entity
@Table(name = "tasks")
public class TaskEntity {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false)
  private String title;

  private String description;

  @Enumerated(EnumType.STRING)
  private TaskStatus status = TaskStatus.TODO;

  // Many-to-one relationship with project
  @ManyToOne
  @JoinColumn(name = "project_id", nullable = false)
  private ProjectEntity project;

  // Many-to-one relationship with user (assigned to)
  @ManyToOne
  @JoinColumn(name = "assigned_to")
  private UserEntity assignedTo;

  private Instant createdAt = Instant.now();
}
