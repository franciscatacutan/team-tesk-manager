package com.example.task_manager.task;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface TaskRepo extends JpaRepository<TaskEntity, Long> {
  List<TaskEntity> findByProjectId(Long projectId);
}
