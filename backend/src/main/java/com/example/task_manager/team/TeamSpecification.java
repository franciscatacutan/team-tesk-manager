package com.example.task_manager.team;

import java.util.UUID;

import org.springframework.data.jpa.domain.Specification;

import com.example.task_manager.common.DeletedFilter;
import com.example.task_manager.team.entity.TeamEntity;
import com.example.task_manager.team.entity.TeamMemberEntity;
import com.example.task_manager.team.entity.TeamRole;
import com.example.task_manager.user.entity.UserEntity;

import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Subquery;

/**
 * Builds dynamic filtering logic for ProjectEntity queries.
 */
public class TeamSpecification {

  public static Specification<TeamEntity> build(
      UUID requesterId,
      String search,
      UUID ownerId,
      UUID memberId,
      DeletedFilter deletedFilter,
      boolean isGlobalAdmin) {

    return Specification
        .where(search(search))
        .and(hasOwner(ownerId))
        .and(hasMember(memberId))
        .and(isAccessibleByUser(requesterId, isGlobalAdmin))
        .and(deletedFilter(requesterId, deletedFilter, isGlobalAdmin));
  }

  private static Specification<TeamEntity> search(String keyword) {

    return (root, query, cb) -> {

      if (keyword == null || keyword.isBlank()) {
        return cb.conjunction();
      }

      String pattern = "%" + keyword.toLowerCase() + "%";

      Join<TeamEntity, UserEntity> ownerJoin = root.join("owner", JoinType.LEFT);

      return cb.or(
          cb.like(cb.lower(root.get("name")), pattern),
          cb.like(cb.lower(root.get("description")), pattern),
          cb.like(cb.lower(ownerJoin.get("firstName")), pattern),
          cb.like(cb.lower(ownerJoin.get("lastName")), pattern));
    };
  }

  private static Specification<TeamEntity> hasOwner(UUID ownerId) {

    return (root, query, cb) -> ownerId == null
        ? cb.conjunction()
        : cb.equal(root.get("owner").get("id"), ownerId);
  }

  private static Specification<TeamEntity> hasMember(UUID memberId) {

    return (root, query, cb) -> {

      if (memberId == null) {
        return cb.conjunction();
      }

      Join<TeamEntity, TeamMemberEntity> memberJoin = root.join("members", JoinType.LEFT);

      return cb.equal(memberJoin.get("user").get("id"), memberId);
    };
  }

  private static Specification<TeamEntity> isAccessibleByUser(
      UUID requesterId,
      boolean isGlobalAdmin) {

    return (root, query, cb) -> {

      if (isGlobalAdmin) {
        return cb.conjunction();
      }

      Join<TeamEntity, TeamMemberEntity> memberJoin = root.join("members", JoinType.LEFT);

      query.distinct(true);

      return cb.or(
          cb.equal(root.get("owner").get("id"), requesterId),
          cb.equal(memberJoin.get("user").get("id"), requesterId));
    };
  }

  private static Specification<TeamEntity> deletedFilter(
      UUID requesterId,
      DeletedFilter filter,
      boolean isGlobalAdmin) {

    return (root, query, cb) -> {

      if (isGlobalAdmin) {
        return switch (filter) {
          case DELETED -> cb.isNotNull(root.get("deletedAt"));
          case ALL -> cb.conjunction();
          case ACTIVE -> cb.isNull(root.get("deletedAt"));
        };
      }

      var active = cb.isNull(root.get("deletedAt"));
      var deletedManageable = cb.and(
          cb.isNotNull(root.get("deletedAt")),
          canManageDeletedTeam(root, query, cb, requesterId));

      return switch (filter) {
        case DELETED -> deletedManageable;
        case ALL -> cb.or(active, deletedManageable);
        case ACTIVE -> active;
      };
    };
  }

  private static jakarta.persistence.criteria.Predicate canManageDeletedTeam(
      jakarta.persistence.criteria.Root<TeamEntity> root,
      jakarta.persistence.criteria.CriteriaQuery<?> query,
      jakarta.persistence.criteria.CriteriaBuilder cb,
      UUID requesterId) {

    Subquery<UUID> subquery = query.subquery(UUID.class);
    var member = subquery.from(TeamMemberEntity.class);
    subquery.select(member.get("id"))
        .where(
            cb.equal(member.get("team").get("id"), root.get("id")),
            cb.equal(member.get("user").get("id"), requesterId),
            member.get("role").in(TeamRole.OWNER, TeamRole.ADMIN));

    return cb.exists(subquery);
  }
}
