package com.example.task_manager.project;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.task_manager.project.entity.ProjectEntity;

/**
 * Repository interface for Project entities.
 */
public interface ProjectRepository extends JpaRepository<ProjectEntity, Long> {

  List<ProjectEntity> findByOwnerId(Long ownerId);
}