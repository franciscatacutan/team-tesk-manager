package com.example.task_manager.team;

import java.time.Instant;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import com.example.task_manager.user.UserEntity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.Getter;
import lombok.Setter;

/**
 * Entity representing team members.
 */
@Entity
@EntityListeners(AuditingEntityListener.class) // Enable auditing for createdAt and updatedAt fields
@Table(name = "team_members", uniqueConstraints = {
    @UniqueConstraint(columnNames = { "user_id", "team_id" })
})
@Getter
@Setter
public class TeamMember {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(optional = false)
  @JoinColumn(name = "user_id")
  private UserEntity user;

  @ManyToOne(optional = false)
  @JoinColumn(name = "team_id")
  private TeamEntity team;

  @Enumerated(EnumType.STRING)
  private TeamRole role;

  @CreatedDate
  @Column(nullable = false, updatable = false)
  private Instant createdAt;

  @LastModifiedDate
  @Column(nullable = false)
  private Instant updatedAt;
}
