package com.example.task_manager.team;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

import com.example.task_manager.team.entity.TeamEntity;

/**
 * Repository interface for Team entities.
 */
public interface TeamRepository extends JpaRepository<TeamEntity, UUID>, JpaSpecificationExecutor<TeamEntity> {
  boolean existsByOwnerIdAndNameAndDeletedAtIsNull(UUID teamId, String name);

  boolean existsByIdAndDeletedAtIsNull(UUID id);

  boolean existsByIdAndOwnerIdAndDeletedAtIsNull(UUID teamId, UUID ownerId);

  Optional<TeamEntity> findByIdAndDeletedAtIsNull(UUID id);

  @Query("""
          SELECT t
          FROM TeamEntity t
          JOIN TeamMemberEntity tm ON tm.team.id = t.id
          WHERE tm.user.id = :userId
            AND t.deletedAt IS NULL
      """)
  Page<TeamEntity> findActiveTeamsByUser(UUID userId, Pageable pageable);
}
