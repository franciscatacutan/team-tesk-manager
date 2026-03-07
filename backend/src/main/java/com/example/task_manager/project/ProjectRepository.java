package com.example.task_manager.project;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import com.example.task_manager.project.entity.ProjectEntity;

/**
 * Repository interface for Project entities.
 */
public interface ProjectRepository extends JpaRepository<ProjectEntity, UUID>, JpaSpecificationExecutor<ProjectEntity> {

  Optional<ProjectEntity> findByIdAndTeamId(UUID projectId, UUID teamId);

  Optional<ProjectEntity> findByIdAndTeamIdAndDeletedAtIsNull(UUID projectId, UUID teamId);

  Page<ProjectEntity> findByTeamId(UUID id, Pageable pageable);

  Page<ProjectEntity> findByTeamIdAndDeletedAtIsNull(UUID id, Pageable pageable);

  boolean existsByIdAndTeamIdAndDeletedAtIsNull(UUID projectId, UUID teamId);

  boolean existsByIdAndTeamId(UUID projectId, UUID teamId);

  boolean existsByTeamIdAndNameAndDeletedAtIsNull(UUID teamId, String name);

  @Modifying(clearAutomatically = true)
  @Query("""
          UPDATE ProjectEntity p
          SET p.deletedAt = :deletedAt
          WHERE p.team.id = :teamId
            AND p.deletedAt IS NULL
      """)
  int softDeleteByTeamId(UUID teamId, Instant deletedAt);

}