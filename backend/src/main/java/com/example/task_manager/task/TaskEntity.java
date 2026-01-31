package com.example.task_manager.task;

import java.time.Instant;

import com.example.task_manager.project.ProjectEntity;
import com.example.task_manager.user.UserEntity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

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

  @ManyToOne
  @JoinColumn(name = "project_id", nullable = false)
  private ProjectEntity project;

  @ManyToOne
  @JoinColumn(name = "assigned_to")
  private UserEntity assignedTo;

  private Instant createdAt = Instant.now();
}
