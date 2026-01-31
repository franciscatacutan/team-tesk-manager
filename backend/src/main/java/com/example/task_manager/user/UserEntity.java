package com.example.task_manager.user;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

import com.example.task_manager.project.ProjectEntity;
import com.example.task_manager.task.TaskEntity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

/**
 * Entity representing a user.
 */
@Getter
@Setter
@Entity
@Table(name = "users")
public class UserEntity {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false)
  private String firstName;

  @Column(nullable = false)
  private String lastName;

  @Column(nullable = false, unique = true)
  private String email;

  @Column(nullable = false)
  private String password;

  // One-to-many relationship with projects (owner)
  @OneToMany(mappedBy = "owner")
  private List<ProjectEntity> projects = new ArrayList<>();

  // One-to-many relationship with tasks (assigned to)
  @OneToMany(mappedBy = "assignedTo")
  private List<TaskEntity> assignedTasks = new ArrayList<>();

  private Instant createdAt = Instant.now();

  private Instant updatedAt;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  private UserRole role;
}
