package com.example.task_manager.task;

import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.example.task_manager.task.entity.TaskUpdateEntity;

/**
 * Repository interface for TaskUpdate entities.
 */
public interface TaskUpdateRepository extends JpaRepository<TaskUpdateEntity, UUID> {
  Page<TaskUpdateEntity> findByTaskIdAndTaskDeletedAtIsNull(UUID taskId, Pageable pageable);

  Page<TaskUpdateEntity> findByTaskId(UUID taskId, Pageable pageable);

}