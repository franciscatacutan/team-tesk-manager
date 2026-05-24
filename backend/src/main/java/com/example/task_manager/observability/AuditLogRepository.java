package com.example.task_manager.observability;

import java.time.Instant;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.example.task_manager.observability.entity.AuditLogEntity;

public interface AuditLogRepository extends JpaRepository<AuditLogEntity, UUID> {
  long countByTeamIdAndOccurredAtAfter(UUID teamId, Instant occurredAt);

  Page<AuditLogEntity> findByTeamId(UUID teamId, Pageable pageable);

  long countByProjectIdAndOccurredAtAfter(UUID projectId, Instant occurredAt);

  Page<AuditLogEntity> findByProjectId(UUID projectId, Pageable pageable);
}
