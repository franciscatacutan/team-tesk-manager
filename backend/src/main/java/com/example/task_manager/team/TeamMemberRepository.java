package com.example.task_manager.team;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import com.example.task_manager.team.entity.TeamMemberEntity;
import com.example.task_manager.team.entity.TeamRole;

/**
 * Repository interface for Team Member entities.
 */
public interface TeamMemberRepository
    extends JpaRepository<TeamMemberEntity, UUID>, JpaSpecificationExecutor<TeamMemberEntity> {

  Optional<TeamMemberEntity> findByTeamIdAndUserIdAndTeamDeletedAtIsNull(UUID teamId, UUID userId);

  boolean existsByTeamIdAndUserId(UUID teamId, UUID userId);

  List<TeamMemberEntity> findMembersByTeamId(UUID teamId);

  Page<TeamMemberEntity> findByUserId(UUID userId, Pageable pageable);

  Optional<TeamMemberEntity> findByTeamIdAndUserId(UUID teamId, UUID userId);

  long countByTeamId(UUID teamId);

  long countByTeamIdAndRole(UUID teamId, TeamRole role);

}
