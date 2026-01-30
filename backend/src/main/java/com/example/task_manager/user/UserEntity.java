package com.example.task_manager.user;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

import com.example.task_manager.project.ProjectEntity;
import com.example.task_manager.task.TaskEntity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
@Entity
@Table(name = "users")
public class UserEntity {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false)
  private String name;

  @Column(nullable = false, unique = true)
  private String email;

  @Column(nullable = false)
  private String password;

  @OneToMany(mappedBy = "owner")
  private List<ProjectEntity> projects = new ArrayList<>();

  @OneToMany(mappedBy = "assignedTo")
  private List<TaskEntity> assignedTasks = new ArrayList<>();

  private Instant createdAt = Instant.now();
}
