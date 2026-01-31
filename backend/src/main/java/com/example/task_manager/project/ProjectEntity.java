package com.example.task_manager.project;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

import com.example.task_manager.task.TaskEntity;
import com.example.task_manager.user.UserEntity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

/**
 * Entity representing a project.
 */
@Getter
@Setter
@Entity
@Table(name = "projects")
public class ProjectEntity {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false)
  private String name;

  private String description;

  // Many-to-one relationship with user (owner)
  @ManyToOne
  @JoinColumn(name = "owner_id", nullable = false)
  private UserEntity owner;

  // One-to-many relationship with tasks
  @OneToMany(mappedBy = "project", cascade = CascadeType.ALL)
  private List<TaskEntity> tasks = new ArrayList<>();

  private Instant createdAt = Instant.now();

  private Instant updatedAt;

}
