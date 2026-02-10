package com.example.task_manager.task;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.task_manager.task.entity.TaskEntity;

/**
 * Repository interface for Task entities.
 */
public interface TaskRepository extends JpaRepository<TaskEntity, Long> {
  List<TaskEntity> findByProjectId(Long projectId);
}
