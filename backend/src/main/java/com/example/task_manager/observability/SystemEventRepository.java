package com.example.task_manager.observability;

import java.time.Instant;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.example.task_manager.observability.entity.SystemEventEntity;

public interface SystemEventRepository extends JpaRepository<SystemEventEntity, UUID> {
  long countByTeamIdAndOccurredAtAfter(UUID teamId, Instant occurredAt);

  Page<SystemEventEntity> findByTeamId(UUID teamId, Pageable pageable);

  long countByProjectIdAndOccurredAtAfter(UUID projectId, Instant occurredAt);

  Page<SystemEventEntity> findByProjectId(UUID projectId, Pageable pageable);
}
