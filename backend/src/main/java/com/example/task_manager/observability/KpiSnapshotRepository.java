package com.example.task_manager.observability;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.task_manager.observability.entity.KpiSnapshotEntity;

public interface KpiSnapshotRepository extends JpaRepository<KpiSnapshotEntity, UUID> {
}
