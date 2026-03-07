package com.example.task_manager.project.entity;

import java.time.Instant;
import java.util.UUID;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import com.example.task_manager.team.entity.TeamEntity;
import com.example.task_manager.user.entity.UserEntity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

/**
 * Entity representing a project.
 */
@Getter
@Setter
@Entity
@EntityListeners(AuditingEntityListener.class) // Enable auditing for createdAt and updatedAt fields
@Table(name = "projects", uniqueConstraints = {
    @UniqueConstraint(name = "uk_project_team_name", columnNames = { "team_id", "name" })
}, indexes = {
    @Index(name = "idx_project_team_deleted", columnList = "team_id, deleted_at")
})
public class ProjectEntity {
  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  private UUID id;

  @Column(nullable = false, length = 100)
  private String name;

  @Column(length = 500)
  private String description;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false, length = 20)
  private ProjectStatus status = ProjectStatus.ACTIVE;

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "team_id", nullable = false)
  private TeamEntity team;

  // Many-to-one relationship with user (owner)
  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "created_by", nullable = false)
  private UserEntity createdBy;

  @Column(name = "next_task_number", nullable = false)
  private Long nextTaskNumber = 1L;

  @CreatedDate
  @Column(nullable = false, updatable = false)
  private Instant createdAt;

  @LastModifiedDate
  @Column(nullable = false)
  private Instant updatedAt;

  private Instant deletedAt;

  @Version
  private Long version;
}
