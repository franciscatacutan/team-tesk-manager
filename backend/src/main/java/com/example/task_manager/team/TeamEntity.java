package com.example.task_manager.team;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import com.example.task_manager.project.ProjectEntity;
import com.example.task_manager.user.UserEntity;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

/**
 * Entity representing a team.
 */
@Getter
@Setter
@Entity
@EntityListeners(AuditingEntityListener.class) // Enable auditing for createdAt and updatedAt fields
@Table(name = "projects")
public class TeamEntity {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false)
  private String name;

  private String description;

  // Many-to-one relationship with user (owner)
  @ManyToOne(optional = false)
  @JoinColumn(name = "owner_id")
  private UserEntity owner;

  // One-to-many relationship with tasks
  @OneToMany(mappedBy = "team", cascade = CascadeType.ALL)
  private List<ProjectEntity> tasks = new ArrayList<>();

  private boolean archived = false;

  @CreatedDate
  @Column(nullable = false, updatable = false)
  private Instant createdAt;

  @LastModifiedDate
  @Column(nullable = false)
  private Instant updatedAt;
}
