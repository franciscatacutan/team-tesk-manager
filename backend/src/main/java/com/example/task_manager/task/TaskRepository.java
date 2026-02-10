package com.example.task_manager.task;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.task_manager.task.entity.TaskEntity;

/**
 * Repository interface for Task entities.
 */
public interface TaskRepository extends JpaRepository<TaskEntity, UUID> {
  List<TaskEntity> findByProjectId(UUID projectId);
}
