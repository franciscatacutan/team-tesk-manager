package com.example.task_manager.team;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.example.task_manager.team.entity.TeamMemberEntity;

/**
 * Repository interface for Team Member entities.
 */
public interface TeamMemberRepository extends JpaRepository<TeamMemberEntity, UUID> {

  Optional<TeamMemberEntity> findByTeamIdAndUserIdAndTeamDeletedAtIsNull(UUID teamId, UUID userId);

  boolean existsByTeamIdAndUserId(UUID teamId, UUID userId);

  List<TeamMemberEntity> findMembersByTeamId(UUID teamId);

  Page<TeamMemberEntity> findByUserId(UUID userId, Pageable pageable);

  Optional<TeamMemberEntity> findByTeamIdAndUserId(UUID teamId, UUID userId);

}
