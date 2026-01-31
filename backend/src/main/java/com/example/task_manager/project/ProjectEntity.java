package com.example.task_manager.project;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

import com.example.task_manager.task.TaskEntity;
import com.example.task_manager.user.UserEntity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

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

  @ManyToOne
  @JoinColumn(name = "owner_id", nullable = false)
  private UserEntity owner;

  @OneToMany(mappedBy = "project", cascade = CascadeType.ALL)
  private List<TaskEntity> tasks = new ArrayList<>();

  private Instant createdAt = Instant.now();
}
