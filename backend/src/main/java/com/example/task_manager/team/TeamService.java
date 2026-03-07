package com.example.task_manager.team;

import java.time.Instant;
import java.util.List;
import java.util.Set;
import java.util.UUID;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import com.example.task_manager.common.PageResponse;
import com.example.task_manager.exception.api.BadRequestInputException;
import com.example.task_manager.exception.api.ConflictException;
import com.example.task_manager.exception.api.ForbiddenException;
import com.example.task_manager.exception.api.ResourceNotFoundException;
import com.example.task_manager.project.ProjectRepository;
import com.example.task_manager.task.TaskRepository;
import com.example.task_manager.team.dto.AddTeamMemberRequest;
import com.example.task_manager.team.dto.CreateTeamRequest;
import com.example.task_manager.team.dto.TeamMemberResponse;
import com.example.task_manager.team.dto.TeamResponse;
import com.example.task_manager.team.dto.TeamSearchRequest;
import com.example.task_manager.team.dto.UpdateTeamRequest;
import com.example.task_manager.team.entity.TeamEntity;
import com.example.task_manager.team.entity.TeamMemberEntity;
import com.example.task_manager.team.entity.TeamRole;
import com.example.task_manager.user.UserRepository;
import com.example.task_manager.user.entity.UserEntity;
import com.example.task_manager.user.entity.UserRole;

import jakarta.persistence.EntityManager;

import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;

/**
 * Contains business logic for managing teams.
 */
@Service
@RequiredArgsConstructor
public class TeamService {

  private final TeamRepository teamRepository;
  private final TeamMemberRepository teamMemberRepository;
  private final UserRepository userRepository;
  private final ProjectRepository projectRepository;
  private final TaskRepository taskRepository;
  private final EntityManager entityManager;

  /**
   * Creates a new team for the authenticated user.
   * Sets user as the owner
   */
  @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN')")
  @Transactional
  public TeamResponse createTeam(
      CreateTeamRequest request,
      String userEmail) {

    UserEntity owner = getUserByEmail(userEmail);

    String trimmedName = request.name().trim();

    validateExistByOwnerAndName(owner.getId(), trimmedName);

    TeamEntity team = new TeamEntity();
    team.setName(trimmedName);
    team.setDescription(request.description());
    team.setOwner(owner);

    // Flush immediately so unique-constraint violations are caught here
    // and mapped to a domain conflict.
    try {
      teamRepository.saveAndFlush(team);
    } catch (DataIntegrityViolationException ex) {
      throw new ConflictException("Team name already exists for User");
    }

    TeamMemberEntity ownerMember = new TeamMemberEntity();
    ownerMember.setTeam(team);
    ownerMember.setUser(owner);
    ownerMember.setRole(TeamRole.OWNER);

    teamMemberRepository.save(ownerMember);

    return mapToResponse(team);
  }

  /**
   * Updates team information.
   * Only Owner can update the team
   */
  @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN')")
  @Transactional
  public TeamResponse updateTeam(
      UUID teamId,
      UpdateTeamRequest request,
      String requesterEmail) {

    UserEntity requester = getUserByEmail(requesterEmail);

    TeamEntity team = getActiveTeam(teamId);

    validateOwner(teamId, requester.getId());

    if (request.name() != null) {

      String trimmedName = request.name().trim();

      if (trimmedName.isEmpty()) {
        throw new BadRequestInputException("Team name cannot be blank");
      }

      validateExistByOwnerAndName(requester.getId(), trimmedName);

      team.setName(trimmedName);
    }

    if (request.description() != null) {
      team.setDescription(request.description().trim());
    }

    return mapToResponse(team);
  }

  /**
   * Soft-deletes a team and cascades soft-delete to all dependent data.
   * Only Owner can soft-delete team
   */
  @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN')")
  @Transactional
  public void deleteTeam(
      UUID teamId,
      String requesterEmail) {

    UserEntity requester = getUserByEmail(requesterEmail);

    TeamEntity team = getActiveTeam(teamId);

    validateOwner(teamId, requester.getId());

    Instant now = Instant.now();

    team.setDeletedAt(now);
    // Bulk repository updates clear persistence context; flush prevents losing
    // the in-memory team update before the transaction commits.
    entityManager.flush();

    // Soft-delete tasks and projects owned by this team.
    taskRepository.softDeleteByTeamId(teamId, now);
    projectRepository.softDeleteByTeamId(teamId, now);
  }

  /**
   * Adds new member in a team
   * New member must be unique for the team
   */
  @Transactional
  public TeamMemberResponse addMember(
      UUID teamId,
      AddTeamMemberRequest request,
      String requesterEmail) {

    UserEntity requester = getUserByEmail(requesterEmail);

    TeamEntity team = getActiveTeam(teamId);

    validateCanManageTeam(teamId, requester.getId());

    UserEntity userToAdd = getUserById(request.userId());

    TeamRole role = request.role() == null
        ? TeamRole.MEMBER
        : request.role();

    if (role == TeamRole.OWNER) {
      throw new ConflictException("Cannot assign OWNER role");
    }

    TeamMemberEntity newMember = new TeamMemberEntity();
    newMember.setTeam(team);
    newMember.setUser(userToAdd);
    newMember.setRole(role);

    // Flush immediately so unique-constraint violations are caught here
    // and mapped to a domain conflict.
    try {
      teamMemberRepository.saveAndFlush(newMember);
    } catch (DataIntegrityViolationException ex) {
      throw new ConflictException("User already in team");
    }

    return mapToMemberResponse(newMember);
  }

  /**
   * Removes a member in a team
   * Only Team Admin and Owner can remove member
   * Only Owner can remove an Admin and can't remove themselves
   */
  @Transactional
  public void removeMember(
      UUID teamId,
      UUID memberUserId,
      String requesterEmail) {

    UserEntity requester = getUserByEmail(requesterEmail);

    TeamMemberEntity requesterMembership = getMembership(teamId, requester.getId());

    TeamMemberEntity memberToRemove = getMembership(teamId, memberUserId);

    if (memberToRemove.getRole() == TeamRole.OWNER) {
      throw new ForbiddenException("Transfer ownership before removing OWNER");
    }

    if (requesterMembership.getRole() == TeamRole.ADMIN &&
        memberToRemove.getRole() != TeamRole.MEMBER) {
      throw new ForbiddenException("ADMIN can only remove MEMBER");
    }

    teamMemberRepository.delete(memberToRemove);
  }

  /**
   * Transfers Team Ownership to another Global Admin or Super Admin
   * New Owner must be a member
   */
  @PreAuthorize("hasAnyRole('SUPER_ADMIN','ADMIN')")
  @Transactional
  public TeamMemberResponse transferOwnership(
      UUID teamId,
      UUID newOwnerUserId,
      String requesterEmail) {

    UserEntity requester = getUserByEmail(requesterEmail);

    validateActiveTeam(teamId);

    TeamMemberEntity owner = getMembership(teamId, requester.getId());

    if (owner.getRole() != TeamRole.OWNER) {
      throw new ForbiddenException("Insufficient permissions");
    }

    if (owner.getId().equals(newOwnerUserId)) {
      throw new ConflictException("You are already the OWNER");
    }

    TeamMemberEntity newOwner = getMembership(teamId, newOwnerUserId);

    validateGlobalAdminAndSuperAdmin(newOwner.getUser().getRole());

    owner.setRole(TeamRole.ADMIN);
    newOwner.setRole(TeamRole.OWNER);

    return mapToMemberResponse(newOwner);
  }

  /**
   * Change User's Role
   * Only Owner and Admin can change
   */
  @Transactional
  public TeamMemberResponse changeTeamRole(
      UUID teamId,
      UUID targetUserId,
      TeamRole newRole,
      String requesterEmail) {

    UserEntity requester = getUserByEmail(requesterEmail);

    validateActiveTeam(teamId);

    validateCanManageTeam(teamId, requester.getId());

    TeamMemberEntity targetMember = getMembership(teamId, targetUserId);

    if (targetMember.getRole() == TeamRole.OWNER) {
      throw new ConflictException("Owner role cannot be modified.");
    }

    if (requester.getId().equals(targetUserId)) {
      throw new ConflictException("You cannot change your own role.");
    }

    if (newRole == TeamRole.OWNER) {
      throw new ConflictException("Use ownership transfer endpoint.");
    }

    targetMember.setRole(newRole);

    return mapToMemberResponse(targetMember);
  }

  /**
   * Returns an non-archived team by id.
   */
  @Transactional(readOnly = true)
  public TeamResponse getActiveTeamById(
      UUID teamId,
      String requesterEmail) {

    UserEntity requester = getUserByEmail(requesterEmail);

    TeamEntity team = getActiveTeam(teamId);

    validateMembership(teamId, requester.getId());

    return mapToResponse(team);
  }

  /**
   * Returns an existing team by id.
   */
  @PreAuthorize("hasAnyRole('SUPER_ADMIN','ADMIN')")
  @Transactional(readOnly = true)
  public TeamResponse getExistingTeamById(
      UUID teamId,
      String requesterEmail) {

    TeamEntity team = getExistingTeam(teamId);

    return mapToResponse(team);
  }

  /**
   * Retrieves teams with support for:
   * - Search
   * - Filtering
   * - Sorting
   * - Pagination
   * - Role-based soft-delete visibility
   */
  @Transactional(readOnly = true)
  public PageResponse<TeamResponse> getTeams(
      TeamSearchRequest request,
      Pageable pageable,
      Authentication authentication) {

    UserEntity requester = getUserByEmail(authentication.getName());

    boolean isGlobalAdmin = authentication.getAuthorities()
        .stream()
        .anyMatch(a -> a.getAuthority().equals("ROLE_SUPER_ADMIN") || a.getAuthority().equals("ROLE_ADMIN"));

    UUID ownerId = null, memberId = null;

    if (isGlobalAdmin) {

      ownerId = request.ownerId();
      memberId = request.memberId();

    }

    Specification<TeamEntity> spec = TeamSpecification.build(
        requester.getId(),
        request.search(),
        ownerId,
        memberId,
        request.includeDeleted(),
        request.onlyDeleted(),
        isGlobalAdmin);

    pageable = validateSorting(pageable);

    Page<TeamEntity> page = teamRepository.findAll(spec, pageable);

    return new PageResponse<>(
        page.map(this::mapToResponse).getContent(),
        page.getNumber(),
        page.getSize(),
        page.getTotalElements(),
        page.getTotalPages(),
        page.isFirst(),
        page.isLast());
  }

  /**
   * Returns all the team's members.
   */
  @Transactional(readOnly = true)
  public List<TeamMemberResponse> getTeamMembers(
      UUID teamId,
      String requesterEmail) {

    UserEntity requester = getUserByEmail(requesterEmail);

    validateMembership(teamId, requester.getId());

    List<TeamMemberEntity> members = teamMemberRepository.findMembersByTeamId(teamId);

    return members.stream()
        .map(member -> new TeamMemberResponse(
            member.getUser().getId(),
            member.getUser().getFirstName(),
            member.getUser().getLastName(),
            member.getUser().getEmail(),
            member.getRole(),
            member.getJoinedAt()))
        .toList();
  }

  // HELPERS

  /**
   * Maps a TeamEntity to a Team Response.
   */
  public TeamResponse mapToResponse(TeamEntity team) {
    TeamResponse.User user = new TeamResponse.User(
        team.getOwner().getId(),
        team.getOwner().getFirstName(),
        team.getOwner().getLastName(),
        team.getOwner().getEmail());

    Boolean isDeleted = team.getDeletedAt() != null ? true : false;

    return new TeamResponse(
        team.getId(),
        team.getName(),
        team.getDescription(),
        user,
        team.getCreatedAt(),
        team.getUpdatedAt(),
        isDeleted);
  }

  /**
   * Maps a TeamMemberEntity to a TeamMemberResponse.
   */
  private TeamMemberResponse mapToMemberResponse(TeamMemberEntity member) {
    return new TeamMemberResponse(
        member.getUser().getId(),
        member.getUser().getFirstName(),
        member.getUser().getLastName(),
        member.getUser().getEmail(),
        member.getRole(),
        member.getJoinedAt());
  }

  /**
   * Returns the user by email
   */
  private UserEntity getUserByEmail(String email) {
    UserEntity user = userRepository.findByEmail(email)
        .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    return user;
  }

  /**
   * Returns the user by id
   */
  private UserEntity getUserById(UUID id) {
    UserEntity user = userRepository.findById(id)
        .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    return user;
  }

  /**
   * Ensures:
   * - Team exists
   * - Team not deleted
   * - Membership exists
   *
   * Returns membership entity.
   * Uses ResourceNotFound to prevent ID probing.
   */
  private TeamMemberEntity getMembership(UUID teamId, UUID userId) {

    return teamMemberRepository
        .findByTeamIdAndUserIdAndTeamDeletedAtIsNull(teamId, userId)
        .orElseThrow(() -> new ResourceNotFoundException("User is not a member"));
  }

  /**
   * Checks if a User is member of a team
   */
  private void validateMembership(UUID teamId, UUID userId) {
    boolean isMember = teamMemberRepository.existsByTeamIdAndUserId(teamId, userId);

    if (!isMember) {
      throw new ResourceNotFoundException("User is not a member");
    }
  }

  /**
   * Checks if a Team Name is under an Owner
   */
  private void validateExistByOwnerAndName(UUID ownerId, String name) {
    boolean team = teamRepository.existsByOwnerIdAndNameAndDeletedAtIsNull(ownerId, name);

    if (team) {
      throw new ConflictException("Team name already exists for User");
    }
  }

  /**
   * Checks if a User is member of a team
   */
  private void validateOwner(UUID teamId, UUID userId) {
    boolean isMember = teamRepository.existsByIdAndOwnerIdAndDeletedAtIsNull(teamId, userId);

    if (!isMember) {
      throw new ResourceNotFoundException("User is not a member");
    }
  }

  /**
   * Ensures:
   * - User is member
   * - Role is OWNER or ADMIN
   */
  private TeamMemberEntity validateCanManageTeam(UUID teamId, UUID userId) {

    TeamMemberEntity membership = getMembership(teamId, userId);

    if (membership.getRole() != TeamRole.OWNER &&
        membership.getRole() != TeamRole.ADMIN) {
      throw new ForbiddenException("Insufficient permissions");
    }

    return membership;
  }

  private void validateGlobalAdminAndSuperAdmin(UserRole role) {
    if (role != UserRole.ADMIN
        && role != UserRole.SUPER_ADMIN) {

      throw new ForbiddenException(
          "You are not allowed to perform this action");
    }
  }

  /**
   * Get an Active Team
   */
  private TeamEntity getActiveTeam(UUID teamId) {
    return teamRepository.findByIdAndDeletedAtIsNull(teamId)
        .orElseThrow(() -> new ResourceNotFoundException("Team not found"));
  }

  /**
   * Check is a Team is active
   */
  private void validateActiveTeam(UUID teamId) {
    boolean team = teamRepository.existsByIdAndDeletedAtIsNull(teamId);
    if (!team) {
      new ResourceNotFoundException("Team not found");
    }
  }

  /**
   * Get an Existing Team
   */
  private TeamEntity getExistingTeam(UUID teamId) {
    return teamRepository.findById(teamId)
        .orElseThrow(() -> new ResourceNotFoundException("Team not found"));
  }

  /*
   * Allowed Sorting Fields
   */
  private static final Set<String> ALLOWED_SORT_FIELDS = Set.of(
      "name",
      "ownerId",
      "createdAt",
      "updatedAt");

  /*
   * Check sort request
   */
  private Pageable validateSorting(Pageable pageable) {

    for (Sort.Order order : pageable.getSort()) {
      if (!ALLOWED_SORT_FIELDS.contains(order.getProperty())) {
        throw new BadRequestInputException(
            "Invalid sort field: " + order.getProperty());
      }
    }

    return pageable;
  }
}
