package com.example.task_manager.project;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Repository interface for Project entities.
 */
public interface ProjectRepo extends JpaRepository<ProjectEntity, Long> {

  List<ProjectEntity> findByOwnerId(Long ownerId);
}