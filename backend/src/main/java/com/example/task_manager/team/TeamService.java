package com.example.task_manager.team;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Optional;
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

import com.example.task_manager.activity.ActivityEventRepository;
import com.example.task_manager.activity.ActivityEventService;
import com.example.task_manager.activity.dto.ActivityEventDetails;
import com.example.task_manager.activity.dto.ActivityEventType;
import com.example.task_manager.activity.entity.ActivityEventEntity;
import com.example.task_manager.common.DeletedFilter;
import com.example.task_manager.common.PageResponse;
import com.example.task_manager.exception.api.BadRequestInputException;
import com.example.task_manager.exception.api.ConflictException;
import com.example.task_manager.exception.api.ForbiddenException;
import com.example.task_manager.exception.api.ResourceNotFoundException;
import com.example.task_manager.project.ProjectRepository;
import com.example.task_manager.project.entity.ProjectEntity;
import com.example.task_manager.task.TaskRepository;
import com.example.task_manager.task.entity.TaskEntity;
import com.example.task_manager.team.dto.AddTeamMembersRequest;
import com.example.task_manager.team.dto.AddTeamMembersResponse;
import com.example.task_manager.team.dto.CreateTeamRequest;
import com.example.task_manager.team.dto.FailedMember;
import com.example.task_manager.team.dto.RemoveTeamMembersRequest;
import com.example.task_manager.team.dto.RemoveTeamMembersResponse;
import com.example.task_manager.team.dto.TeamActivityResponse;
import com.example.task_manager.team.dto.TeamMeResponse;
import com.example.task_manager.team.dto.TeamMemberRequest;
import com.example.task_manager.team.dto.TeamMemberResponse;
import com.example.task_manager.team.dto.TeamMemberSearchRequest;
import com.example.task_manager.team.dto.TeamResponse;
import com.example.task_manager.team.dto.TeamSearchRequest;
import com.example.task_manager.team.dto.UpdateTeamRequest;
import com.example.task_manager.team.entity.TeamEntity;
import com.example.task_manager.team.entity.TeamMemberEntity;
import com.example.task_manager.team.entity.TeamRole;
import com.example.task_manager.user.UserRepository;
import com.example.task_manager.user.UserSpecification;
import com.example.task_manager.user.dto.UserResponse;
import com.example.task_manager.user.entity.UserEntity;
import com.example.task_manager.user.entity.UserRole;

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
  private final ActivityEventRepository activityEventRepository;
  private final ActivityEventService activityEventService;

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

    String trimmedName = request.name().trim().toLowerCase(Locale.ROOT);

    validateExistByOwnerAndName(owner.getId(), trimmedName);

    TeamEntity team = new TeamEntity();
    team.setName(request.name().trim());
    team.setDescription(request.description());
    team.setOwner(owner);
    team.setCreatedBy(owner);
    team.setOwnerChangedAt(Instant.now());
    team.setMembershipChangedAt(Instant.now());

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

    activityEventService.recordTeamEvent(
        team,
        owner,
        ActivityEventType.TEAM_CREATED,
        buildTeamActivityDetails(
            List.of("name", "description", "owner"),
            null,
            null,
            null,
            List.of(
                activityEventService.change("name", "name", null, team.getName()),
                activityEventService.change("description", "description", null, team.getDescription()),
                activityEventService.change("owner", "owner", null, owner.getFullName())),
            owner),
        null);

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

    String previousName = team.getName();
    String previousDescription = team.getDescription();

    if (request.name() != null) {

      if (request.name().isBlank()) {
        throw new BadRequestInputException("Team name cannot be blank");
      }

      String trimmedName = request.name().trim().toLowerCase(Locale.ROOT);

      if (!team.getName().equalsIgnoreCase(request.name().trim())) {
        validateExistByOwnerAndName(requester.getId(), trimmedName);
      }

      team.setName(request.name().trim());
    }

    if (request.description() != null) {
      team.setDescription(request.description().trim());
    }

    TeamDetailsUpdateMessage updateMessage = buildTeamUpdateMessage(
        previousName,
        previousDescription,
        team.getName(),
        team.getDescription());

    if (!updateMessage.fields().isEmpty()) {
      activityEventService.recordTeamEvent(
          team,
          requester,
          ActivityEventType.TEAM_UPDATED,
          buildTeamActivityDetails(
              updateMessage.fields(),
              null,
              null,
              null,
              updateMessage.changes(),
              null),
          updateMessage.message());
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
    List<TaskEntity> activeTasks = taskRepository
        .findAllByProjectTeamIdAndDeletedAtIsNull(teamId);
    List<ProjectEntity> activeProjects = projectRepository
        .findAllByTeamIdAndDeletedAtIsNull(teamId);

    team.setDeletedAt(now);
    team.setDeletedBy(requester);

    for (com.example.task_manager.task.entity.TaskEntity task : activeTasks) {
      task.setDeletedAt(now);
      activityEventService.recordTaskEvent(
          task,
          requester,
          ActivityEventType.TASK_DELETED,
          activityEventService.emptyDetails(),
          null);
    }

    for (com.example.task_manager.project.entity.ProjectEntity project : activeProjects) {
      project.setDeletedAt(now);
      activityEventService.recordProjectEvent(
          project,
          requester,
          ActivityEventType.PROJECT_DELETED,
          activityEventService.emptyDetails(),
          null);
    }

    activityEventService.recordTeamEvent(
        team,
        requester,
        ActivityEventType.TEAM_DELETED,
        activityEventService.emptyDetails(),
        null);
  }

  /**
   * Adds members in a team
   * New member must be unique for the team
   */
  @Transactional
  public AddTeamMembersResponse addMembers(
      UUID teamId,
      AddTeamMembersRequest request,
      String requesterEmail) {

    UserEntity requester = getUserByEmail(requesterEmail);
    TeamEntity team = getActiveTeam(teamId);

    validateCanManageTeam(teamId, requester.getId());

    List<TeamMemberResponse> success = new ArrayList<>();
    List<FailedMember> failed = new ArrayList<>();

    for (TeamMemberRequest user : request.members()) {

      try {
        TeamMemberEntity member = createMember(team, user);

        teamMemberRepository.flush();

        success.add(mapToMemberResponse(member));

        activityEventService.recordTeamEvent(
            team,
            requester,
            ActivityEventType.TEAM_MEMBER_ADDED,
            buildTeamActivityDetails(
                List.of("member", "role"),
                null,
                member.getRole().name(),
                member.getUser().getFullName(),
                List.of(
                    activityEventService.change("member", "member", null,
                        member.getUser().getFullName()),
                    activityEventService.change("role", "role", null, member.getRole())),
                member.getUser()),
            null);
        team.setMembershipChangedAt(Instant.now());
      } catch (Exception ex) {
        failed.add(new FailedMember(user.userId(), ex.getMessage()));
      }
    }

    return new AddTeamMembersResponse(success, failed);
  }

  /**
   * Removes a member in a team
   * Team Admin and Owner can remove member
   * Only Owner can remove an Admin and can't remove themselves
   */
  @Transactional
  public RemoveTeamMembersResponse removeMembers(
      UUID teamId,
      RemoveTeamMembersRequest request,
      String requesterEmail) {

    UserEntity requester = getUserByEmail(requesterEmail);
    TeamMemberEntity requesterMembership = getMembership(teamId, requester.getId());

    validateCanManageTeam(teamId, requester.getId());

    List<UUID> success = new ArrayList<>();
    List<FailedMember> failed = new ArrayList<>();

    for (UUID userId : request.userIds()) {

      try {
        TeamMemberEntity memberToRemove = getMembership(teamId, userId);
        TeamEntity team = memberToRemove.getTeam();

        if (memberToRemove.getRole() == TeamRole.OWNER) {
          throw new IllegalStateException("Transfer ownership before removing OWNER");
        }

        if (requesterMembership.getRole() == TeamRole.ADMIN &&
            memberToRemove.getRole() != TeamRole.MEMBER) {
          throw new IllegalStateException("ADMIN can only remove MEMBER");
        }

        if (!teamMemberRepository.existsByTeamIdAndUserId(teamId, userId)) {
          throw new ResourceNotFoundException("User is not a member");
        }
        teamMemberRepository.delete(memberToRemove);

        teamMemberRepository.flush();
        team.setMembershipChangedAt(Instant.now());

        activityEventService.recordTeamEvent(
            team,
            requester,
            ActivityEventType.TEAM_MEMBER_REMOVED,
            buildTeamActivityDetails(
                List.of("member", "role"),
                memberToRemove.getRole().name(),
                null,
                memberToRemove.getUser().getFullName(),
                List.of(
                    activityEventService.change("member", "member", memberToRemove.getUser().getFullName(), null),
                    activityEventService.change("role", "role", memberToRemove.getRole(), null)),
                memberToRemove.getUser()),
            null);

        success.add(userId);

      } catch (Exception ex) {
        failed.add(new FailedMember(userId, ex.getMessage()));
      }
    }

    return new RemoveTeamMembersResponse(success, failed);
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

    validateGlobalAdminOrSuperAdmin(newOwner.getUser().getRole());

    owner.setRole(TeamRole.ADMIN);
    newOwner.setRole(TeamRole.OWNER);
    newOwner.getTeam().setOwner(newOwner.getUser());
    newOwner.getTeam().setOwnerChangedAt(Instant.now());
    newOwner.getTeam().setMembershipChangedAt(Instant.now());

    activityEventService.recordTeamEvent(
        newOwner.getTeam(),
        requester,
        ActivityEventType.TEAM_OWNERSHIP_TRANSFERRED,
        buildTeamActivityDetails(
            List.of("owner"),
            owner.getUser().getFullName(),
            newOwner.getUser().getFullName(),
            newOwner.getUser().getFullName(),
            List.of(activityEventService.change("owner", "owner", owner.getUser().getFullName(),
                newOwner.getUser().getFullName())),
            newOwner.getUser()),
        null);

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

    validateOwner(teamId, requester.getId());

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

    TeamRole previousRole = targetMember.getRole();
    if (previousRole == newRole) {
      return mapToMemberResponse(targetMember);
    }

    targetMember.setRole(newRole);
    targetMember.getTeam().setMembershipChangedAt(Instant.now());

    activityEventService.recordTeamEvent(
        targetMember.getTeam(),
        requester,
        ActivityEventType.TEAM_MEMBER_ROLE_CHANGED,
        buildTeamActivityDetails(
            List.of("role"),
            previousRole.name(),
            newRole.name(),
            targetMember.getUser().getFullName(),
            List.of(activityEventService.change("role", "role", previousRole, newRole)),
            targetMember.getUser()),
        null);

    return mapToMemberResponse(targetMember);
  }

  /**
   * Returns an non-archived team by id.
   */
  @Transactional(readOnly = true)
  public TeamResponse getActiveTeamById(
      UUID teamId,
      Authentication authentication) {

    UserEntity requester = getUserByEmail(authentication.getName());

    TeamEntity team = getActiveTeam(teamId);

    boolean isGlobalAdmin = authentication.getAuthorities()
        .stream()
        .anyMatch(a -> a.getAuthority().equals("ROLE_SUPER_ADMIN") || a.getAuthority().equals("ROLE_ADMIN"));

    if (!isGlobalAdmin) {
      validateMembership(teamId, requester.getId());
    }
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

    DeletedFilter filter = request.deletedFilter();

    if (!isGlobalAdmin && filter != DeletedFilter.ACTIVE) {
      throw new ForbiddenException("Not allowed to view deleted tasks");
    }

    Specification<TeamEntity> spec = TeamSpecification.build(
        requester.getId(),
        request.search(),
        request.ownerId(),
        request.memberId(),
        request.deletedFilter(),
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
  public PageResponse<TeamMemberResponse> getTeamMembers(
      TeamMemberSearchRequest request,
      UUID teamId,
      Pageable pageable,
      Authentication authentication) {

    UserEntity requester = getUserByEmail(authentication.getName());

    boolean isGlobalAdmin = authentication.getAuthorities()
        .stream()
        .anyMatch(a -> a.getAuthority().equals("ROLE_SUPER_ADMIN") || a.getAuthority().equals("ROLE_ADMIN"));

    boolean isTeamMember = teamMemberRepository.existsByTeamIdAndUserId(teamId, requester.getId());

    Specification<TeamMemberEntity> spec = TeamMemberSpecification.build(
        teamId,
        request.search(),
        requester.getId(),
        request.roles(),
        isGlobalAdmin,
        isTeamMember);

    pageable = validateSorting(pageable);

    Page<TeamMemberEntity> page = teamMemberRepository.findAll(spec, pageable);

    return new PageResponse<>(
        page.map(this::mapToMemberResponse).getContent(),
        page.getNumber(),
        page.getSize(),
        page.getTotalElements(),
        page.getTotalPages(),
        page.isFirst(),
        page.isLast());
  }

  /**
   * Returns all the user thats not part of the team .
   */
  @Transactional(readOnly = true)
  public PageResponse<UserResponse> getAvailableUsers(
      String search,
      UUID teamId,
      Pageable pageable,
      Authentication authentication) {

    Specification<UserEntity> spec = UserSpecification.availableUsers(teamId, search);

    pageable = validateSorting(pageable);

    Page<UserEntity> page = userRepository.findAll(spec, pageable);

    return new PageResponse<>(
        page.map(this::mapToNonMemberResponse).getContent(),
        page.getNumber(),
        page.getSize(),
        page.getTotalElements(),
        page.getTotalPages(),
        page.isFirst(),
        page.isLast());
  }

  /**
   * Returns user's team role.
   */
  @Transactional(readOnly = true)
  public TeamMeResponse getMyTeamRole(UUID teamId, String requesterEmail) {

    UserEntity requester = getUserByEmail(requesterEmail);
    UserRole globalRole = requester.getRole();

    Optional<TeamMemberEntity> member = teamMemberRepository
        .findByTeamIdAndUserId(teamId, requester.getId());

    // Case 1: User is a team member
    if (member.isPresent()) {
      return new TeamMeResponse(member.get().getUser().getId(), member.get().getRole());
    }

    // Case 2: Global / Super admin but not team member
    if (globalRole == UserRole.ADMIN || globalRole == UserRole.SUPER_ADMIN) {
      return new TeamMeResponse(requester.getId(), null);
    }

    // Case 3: Not allowed
    throw new ForbiddenException("User is not a member of this team");
  }

  /**
   * Returns an existing projects by id.
   */
  @Transactional(readOnly = true)
  public PageResponse<TeamActivityResponse> getTeamActivities(
      UUID teamId,
      Pageable pageable) {

    Page<ActivityEventEntity> page = activityEventRepository.findTeamActivity(teamId, pageable);

    return new PageResponse<>(
        page.map(activityEventService::toTeamActivitiesResponse).getContent(),
        page.getNumber(),
        page.getSize(),
        page.getTotalElements(),
        page.getTotalPages(),
        page.isFirst(),
        page.isLast());
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

    TeamResponse.User createdBy = team.getCreatedBy() == null
        ? null
        : new TeamResponse.User(
            team.getCreatedBy().getId(),
            team.getCreatedBy().getFirstName(),
            team.getCreatedBy().getLastName(),
            team.getCreatedBy().getEmail());

    TeamResponse.User deletedBy = team.getDeletedBy() == null
        ? null
        : new TeamResponse.User(
            team.getDeletedBy().getId(),
            team.getDeletedBy().getFirstName(),
            team.getDeletedBy().getLastName(),
            team.getDeletedBy().getEmail());

    Boolean isDeleted = team.getDeletedAt() != null ? true : false;

    return new TeamResponse(
        team.getId(),
        team.getName(),
        team.getDescription(),
        user,
        createdBy,
        deletedBy,
        team.getCreatedAt(),
        team.getUpdatedAt(),
        team.getLastActivityAt(),
        team.getOwnerChangedAt(),
        team.getMembershipChangedAt(),
        team.getDeletedAt(),
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
        member.getUser().getRole(),
        member.getJoinedAt());
  }

  /**
   * Maps a TeamMemberEntity to a TeamMemberResponse.
   */
  private UserResponse mapToNonMemberResponse(UserEntity user) {
    return new UserResponse(
        user.getId(),
        user.getFirstName(),
        user.getLastName(),
        user.getEmail(),
        user.getRole());
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
   * Checks if a Team Name is unique for an Owner
   */
  private void validateExistByOwnerAndName(UUID ownerId, String name) {
    boolean team = teamRepository.existsByOwnerIdAndNameIgnoreCaseAndDeletedAtIsNull(ownerId, name);

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

  private void validateGlobalAdminOrSuperAdmin(UserRole role) {
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
      throw new ResourceNotFoundException("Team not found");
    }
  }

  /**
   * Add user in a team
   */
  private TeamMemberEntity createMember(
      TeamEntity team,
      TeamMemberRequest request) {

    UserEntity user = getUserById(request.userId());

    if (teamMemberRepository.existsByTeamIdAndUserId(team.getId(), request.userId())) {
      throw new ConflictException("User is already a member of the team");
    }

    TeamRole role = request.role() == null
        ? TeamRole.MEMBER
        : request.role();

    if (role == TeamRole.OWNER) {
      throw new ConflictException("Cannot assign OWNER role");
    }

    TeamMemberEntity member = new TeamMemberEntity();
    member.setTeam(team);
    member.setUser(user);
    member.setRole(role);

    return teamMemberRepository.save(member);
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
      "lastName",
      "owner",
      "lastActivityAt",
      "joinedAt",
      "createdAt",
      "updatedAt",
      "user.lastName",
      "user.email",
      "role");

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

  private ActivityEventDetails buildTeamActivityDetails(
      List<String> fields,
      String from,
      String to,
      String target,
      List<ActivityEventDetails.ActivityChange> changes,
      UserEntity subjectUser) {
    return new ActivityEventDetails(
        fields,
        from,
        to,
        target,
        changes,
        null,
        null,
        null,
        subjectUser == null ? null : activityEventService.reference(subjectUser));
  }

  private TeamDetailsUpdateMessage buildTeamUpdateMessage(
      String previousName,
      String previousDescription,
      String newName,
      String newDescription) {

    List<String> fields = new ArrayList<>();
    List<ActivityEventDetails.ActivityChange> changes = new ArrayList<>();

    if (!java.util.Objects.equals(previousName, newName)) {
      fields.add("name");
      changes.add(activityEventService.change("name", "name", previousName, newName));
    }

    if (!java.util.Objects.equals(previousDescription, newDescription)) {
      fields.add("description");
      changes.add(activityEventService.change("description", "description", previousDescription, newDescription));
    }

    if (fields.isEmpty()) {
      return new TeamDetailsUpdateMessage("Team updated", List.of(), List.of());
    }

    return new TeamDetailsUpdateMessage(
        "Team updated: " + String.join(", ", fields),
        fields,
        changes);
  }

  private record TeamDetailsUpdateMessage(
      String message,
      List<String> fields,
      List<ActivityEventDetails.ActivityChange> changes) {
  }

}
