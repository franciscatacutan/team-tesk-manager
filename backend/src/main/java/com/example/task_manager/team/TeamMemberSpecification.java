package com.example.task_manager.team;

import java.util.Set;
import java.util.UUID;

import org.springframework.data.jpa.domain.Specification;

import com.example.task_manager.team.entity.TeamMemberEntity;
import com.example.task_manager.team.entity.TeamRole;
import com.example.task_manager.user.entity.UserEntity;

import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;

/**
 * Builds dynamic filtering logic for TeamMemberEntity queries.
 */
public class TeamMemberSpecification {

  public static Specification<TeamMemberEntity> build(
      UUID teamId,
      String search,
      UUID requesterId,
      Set<TeamRole> roles,
      boolean isGlobalAdmin,
      boolean isTeamMember) {

    return Specification
        .where(belongsToTeam(teamId))
        .and(search(search))
        .and(hasRoles(roles))
        .and(isAccessibleByUser(teamId, isGlobalAdmin, isTeamMember));
  }

  /**
   * Filter members by team
   */
  private static Specification<TeamMemberEntity> belongsToTeam(UUID teamId) {
    return (root, query, cb) -> {
      if (teamId == null) {
        return cb.conjunction();
      }

      return cb.equal(root.get("team").get("id"), teamId);
    };
  }

  /**
   * Search by user name or email
   */
  private static Specification<TeamMemberEntity> search(String keyword) {
    return (root, query, cb) -> {

      if (keyword == null || keyword.isBlank()) {
        return cb.conjunction();
      }

      String pattern = "%" + keyword.toLowerCase() + "%";

      Join<TeamMemberEntity, UserEntity> userJoin = root.join("user", JoinType.LEFT);

      return cb.or(
          cb.like(cb.lower(userJoin.get("firstName")), pattern),
          cb.like(cb.lower(userJoin.get("lastName")), pattern),
          cb.like(cb.lower(userJoin.get("email")), pattern));
    };
  }

  /**
   * Access control:
   * - Global admin → can see all
   * - Otherwise → only members of the team
   */
  private static Specification<TeamMemberEntity> isAccessibleByUser(
      UUID teamId,
      boolean isGlobalAdmin,
      boolean isTeamMember) {

    return (root, query, cb) -> {

      if (isGlobalAdmin) {
        return cb.conjunction();
      }

      if (isTeamMember) {
        return cb.equal(root.get("team").get("id"), teamId);
      }

      return cb.disjunction();
    };
  }

  private static Specification<TeamMemberEntity> hasRoles(Set<TeamRole> roles) {
    return (root, query, cb) -> {

      if (roles == null || roles.isEmpty()) {
        return cb.conjunction();
      }

      return root.get("role").in(roles);
    };
  }
}