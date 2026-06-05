package com.example.task_manager.project;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Objects;
import java.util.Set;
import java.util.UUID;
import java.util.function.Function;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.task_manager.activity.ActivityEventRepository;
import com.example.task_manager.activity.ActivityEventService;
import com.example.task_manager.activity.dto.ActivityEventDetails;
import com.example.task_manager.activity.entity.ActivityEventEntity;
import com.example.task_manager.activity.dto.ActivityEventType;
import com.example.task_manager.common.PageResponse;
import com.example.task_manager.exception.api.BadRequestInputException;
import com.example.task_manager.exception.api.ConflictException;
import com.example.task_manager.exception.api.ForbiddenException;
import com.example.task_manager.exception.api.ResourceNotFoundException;
import com.example.task_manager.project.dto.ChangeProjectStatusRequest;
import com.example.task_manager.project.dto.CreateProjectRequest;
import com.example.task_manager.project.dto.ProjectActivityResponse;
import com.example.task_manager.project.dto.ProjectResponse;
import com.example.task_manager.project.dto.ProjectSearchRequest;
import com.example.task_manager.project.dto.UpdateProjectDetailsRequest;
import com.example.task_manager.project.entity.ProjectEntity;
import com.example.task_manager.project.entity.ProjectStatus;
import com.example.task_manager.task.TaskRepository;
import com.example.task_manager.task.entity.TaskEntity;
import com.example.task_manager.team.TeamMemberRepository;
import com.example.task_manager.team.TeamRepository;
import com.example.task_manager.team.entity.TeamEntity;
import com.example.task_manager.team.entity.TeamMemberEntity;
import com.example.task_manager.team.entity.TeamRole;
import com.example.task_manager.user.UserRepository;
import com.example.task_manager.user.entity.UserEntity;

import lombok.RequiredArgsConstructor;

/**
 * Contains business logic for managing projects.
 */
@Service
@RequiredArgsConstructor
public class ProjectService {

  private static final Set<TeamRole> TEAM_MANAGEMENT_ROLES = Set.of(TeamRole.OWNER, TeamRole.ADMIN);

  private static final Set<String> ALLOWED_SORT_FIELDS = Set.of(
      "name",
      "owner",
      "status",
      "plannedStartDate",
      "plannedDueDate",
      "actualCompletionDate",
      "createdBy",
      "lastActivityAt",
      "statusChangedAt",
      "createdAt",
      "updatedAt");

  private final ProjectRepository projectRepository;
  private final TeamRepository teamRepository;
  private final TeamMemberRepository teamMemberRepository;
  private final TaskRepository taskRepository;
  private final UserRepository userRepository;
  private final ActivityEventRepository activityEventRepository;
  private final ActivityEventService activityEventService;

  /**
   * Creates a new project for the authenticated user.
   * User must be Team Owner or Admin
   * Project name must be unique for Team
   */
  @Transactional
  public ProjectResponse createProject(
      UUID teamId,
      CreateProjectRequest request,
      String requesterEmail) {

    UserEntity requester = getUserByEmail(requesterEmail);

    TeamMemberEntity requesterMembership = requireManagerMembership(teamId, requester.getId());

    String trimmedName = normalizeProjectName(request.name());

    validateExistByTeamAndName(teamId, trimmedName);
    validateDates(request.plannedStartDate(), request.plannedDueDate());

    ProjectEntity project = new ProjectEntity();
    project.setName(request.name().trim());
    project.setDescription(request.description());
    project.setStatus(ProjectStatus.ACTIVE);
    project.setTeam(requesterMembership.getTeam());
    project.setCreatedBy(requester);
    project.setOwner(requester);
    project.setPlannedStartDate(request.plannedStartDate());
    project.setPlannedDueDate(request.plannedDueDate());
    project.setActualStartDate(Instant.now());
    project.setStatusChangedAt(Instant.now());

    // Flush immediately so unique-constraint violations are caught here
    // and mapped to a domain conflict.
    try {
      projectRepository.saveAndFlush(project);
    } catch (DataIntegrityViolationException ex) {
      throw new ConflictException("Project name already exists in this team");
    }

    activityEventService.recordProjectEvent(
        project,
        requester,
        ActivityEventType.PROJECT_CREATED,
        buildProjectActivityDetails(
            List.of("name", "description", "status", "planned start", "planned due"),
            null,
            null,
            null,
            List.of(
                activityEventService.change("name", "name", null, project.getName()),
                activityEventService.change("description", "description", null, project.getDescription()),
                activityEventService.change("status", "status", null, project.getStatus()),
                activityEventService.change("plannedStartDate", "planned start", null, project.getPlannedStartDate()),
                activityEventService.change("plannedDueDate", "planned due", null, project.getPlannedDueDate())),
            null),
        null);

    return mapToResponse(project);
  }

  /**
   * Updates an existing project.
   * Only Owner and Admin can update the project
   */
  @Transactional
  public ProjectResponse updateProject(
      UUID teamId,
      UUID projectId,
      UpdateProjectDetailsRequest request,
      String requesterEmail) {

    UserEntity requester = getUserByEmail(requesterEmail);

    requireManagerMembership(teamId, requester.getId());

    ProjectEntity project = requireActiveProject(projectId, teamId);

    String previousName = project.getName();
    String previousDescription = project.getDescription();
    Instant previousPlannedStart = project.getPlannedStartDate();
    Instant previousPlannedDue = project.getPlannedDueDate();

    if (request.name() != null) {

      if (request.name().isBlank()) {
        throw new BadRequestInputException("Project name cannot be blank");
      }
      String trimmedName = normalizeProjectName(request.name());

      if (!project.getName().equalsIgnoreCase(request.name().trim())) {
        validateExistByTeamAndName(teamId, trimmedName);
      }

      project.setName(request.name().trim());
    }

    if (request.description() != null) {
      project.setDescription(request.description().trim());
    }

    Instant newPlannedStart = request.plannedStartDate() != null
        ? request.plannedStartDate()
        : project.getPlannedStartDate();

    Instant newPlannedDue = request.plannedDueDate() != null
        ? request.plannedDueDate()
        : project.getPlannedDueDate();

    validateDates(newPlannedStart, newPlannedDue);

    project.setPlannedStartDate(newPlannedStart);
    project.setPlannedDueDate(newPlannedDue);

    ProjectDetailsUpdateMessage updateMessage = buildProjectUpdateMessage(
        previousName,
        previousDescription,
        previousPlannedStart,
        previousPlannedDue,
        project.getName(),
        project.getDescription(),
        project.getPlannedStartDate(),
        project.getPlannedDueDate());

    if (!updateMessage.fields().isEmpty()) {
      activityEventService.recordProjectEvent(
          project,
          requester,
          ActivityEventType.PROJECT_UPDATED,
          buildProjectActivityDetails(
              updateMessage.fields(),
              null,
              null,
              null,
              updateMessage.changes(),
              null),
          updateMessage.message());
    }

    return mapToResponse(project);
  }

  /**
   * Soft-deletes a project and cascades soft-delete to all dependent data.
   * Only Owner and Admin can soft-delete project
   */
  @Transactional
  public void deleteProject(
      UUID teamId,
      UUID projectId,
      String requesterEmail) {

    UserEntity requester = getUserByEmail(requesterEmail);

    requireManagerMembership(teamId, requester.getId());

    ProjectEntity project = requireActiveProject(projectId, teamId);

    Instant now = Instant.now();
    List<TaskEntity> activeTasks = taskRepository
        .findAllByProjectIdAndDeletedAtIsNull(projectId);

    project.setStatus(ProjectStatus.DELETED);
    project.setStatusChangedAt(Instant.now());
    project.setDeletedAt(now);
    project.setDeletedBy(requester);

    for (TaskEntity task : activeTasks) {
      task.setDeletedAt(now);
      activityEventService.recordTaskEvent(
          task,
          requester,
          ActivityEventType.TASK_DELETED,
          activityEventService.emptyDetails(),
          null);
    }

    activityEventService.recordProjectEvent(
        project,
        requester,
        ActivityEventType.PROJECT_DELETED,
        activityEventService.emptyDetails(),
        null);

  }

  /**
   * Change the status of a project
   * Only admin and owner can change status
   */
  @Transactional
  public ProjectResponse changeProjectStatus(
      UUID teamId,
      UUID projectId,
      ChangeProjectStatusRequest newStatus,
      String requesterEmail) {

    UserEntity requester = getUserByEmail(requesterEmail);

    requireManagerMembership(teamId, requester.getId());

    ProjectEntity project = requireActiveProject(projectId, teamId);

    validateStatusChange(project, newStatus.status());

    ProjectStatus currentStatus = project.getStatus();
    project.setStatus(newStatus.status());
    project.setStatusChangedAt(Instant.now());

    if (newStatus.status() == ProjectStatus.ACTIVE && project.getActualStartDate() == null) {
      project.setActualStartDate(Instant.now());
    }

    if (newStatus.status() == ProjectStatus.COMPLETED) {
      project.setActualCompletionDate(Instant.now());
      project.setCompletedBy(requester);
    }

    if (currentStatus == ProjectStatus.COMPLETED && newStatus.status() != ProjectStatus.COMPLETED) {
      project.setActualCompletionDate(null);
      project.setCompletedBy(null);
    }

    activityEventService.recordProjectEvent(
        project,
        requester,
        ActivityEventType.PROJECT_STATUS_CHANGED,
        buildProjectActivityDetails(
            List.of("status"),
            currentStatus.name(),
            newStatus.status().name(),
            null,
            List.of(activityEventService.change("status", "status", currentStatus, newStatus.status())),
            null),
        null);

    return mapToResponse(project);
  }

  /**
   * Retrieves projects for a team with support for:
   * - Search
   * - Filtering
   * - Sorting
   * - Pagination
   * - Role-based soft-delete visibility
   */
  @Transactional(readOnly = true)
  public PageResponse<ProjectResponse> getProjects(
      UUID teamId,
      ProjectSearchRequest request,
      Pageable pageable,
      Authentication authentication) {

    UserEntity requester = getUserByEmail(authentication.getName());

    TeamEntity team = requireTeam(teamId);
    boolean isGlobalAdmin = hasGlobalAdminAuthority(authentication);
    boolean canViewDeleted = canViewDeletedProjects(team, requester.getId(), isGlobalAdmin);

    pageable = request.all()
        ? Pageable.unpaged()
        : validateSorting(pageable);

    Specification<ProjectEntity> spec = ProjectSpecification.build(
        teamId,
        request.search(),
        request.status(),
        request.createdBy(),
        request.deletedFilter(),
        canViewDeleted);

    Page<ProjectEntity> page = projectRepository.findAll(spec, pageable);

    return toPageResponse(page, this::mapToResponse);
  }

  @Transactional(readOnly = true)
  public ProjectResponse getProjectById(
      UUID teamId,
      UUID projectId,
      Authentication authentication) {

    UserEntity requester = getUserByEmail(authentication.getName());
    boolean isGlobalAdmin = hasGlobalAdminAuthority(authentication);

    ProjectEntity project = requireProject(projectId, teamId);

    ensureCanReadProject(project, requester.getId(), isGlobalAdmin);

    return mapToResponse(project);
  }

  /**
   * Returns all updates by projects.
   */
  @Transactional(readOnly = true)
  public PageResponse<ProjectActivityResponse> getProjectActivities(
      UUID teamId,
      UUID projectId,
      Pageable pageable,
      Authentication authentication) {

    UserEntity requester = getUserByEmail(authentication.getName());
    boolean isGlobalAdmin = hasGlobalAdminAuthority(authentication);
    ProjectEntity project = requireProject(projectId, teamId);
    ensureCanReadProject(project, requester.getId(), isGlobalAdmin);

    Page<ActivityEventEntity> page = activityEventRepository.findByProjectId(projectId, pageable);

    return toPageResponse(page, activityEventService::toProjectActivitiesResponse);
  }

  // ********************
  // HELPERS
  // ********************

  private <T, R> PageResponse<R> toPageResponse(Page<T> page, Function<T, R> mapper) {
    return new PageResponse<>(
        page.map(mapper).getContent(),
        page.getNumber(),
        page.getSize(),
        page.getTotalElements(),
        page.getTotalPages(),
        page.isFirst(),
        page.isLast());
  }

  /**
   * Maps a ProjectEntity to a Project Response.
   */
  private ProjectResponse mapToResponse(ProjectEntity project) {
    ProjectResponse.ProjectUserSummary owner = new ProjectResponse.ProjectUserSummary(
        project.getOwner().getId(),
        project.getOwner().getFirstName(),
        project.getOwner().getLastName(),
        project.getOwner().getEmail());

    ProjectResponse.ProjectUserSummary createdBy = new ProjectResponse.ProjectUserSummary(
        project.getCreatedBy().getId(),
        project.getCreatedBy().getFirstName(),
        project.getCreatedBy().getLastName(),
        project.getCreatedBy().getEmail());

    ProjectResponse.ProjectUserSummary completedBy = project.getCompletedBy() == null
        ? null
        : new ProjectResponse.ProjectUserSummary(
            project.getCompletedBy().getId(),
            project.getCompletedBy().getFirstName(),
            project.getCompletedBy().getLastName(),
            project.getCompletedBy().getEmail());

    ProjectResponse.ProjectUserSummary deletedBy = project.getDeletedBy() == null
        ? null
        : new ProjectResponse.ProjectUserSummary(
            project.getDeletedBy().getId(),
            project.getDeletedBy().getFirstName(),
            project.getDeletedBy().getLastName(),
            project.getDeletedBy().getEmail());

    boolean isDeleted = project.getDeletedAt() != null;

    return new ProjectResponse(
        project.getId(),
        project.getName(),
        project.getDescription(),
        project.getStatus(),
        project.getTeam().getId(),
        owner,
        createdBy,
        completedBy,
        deletedBy,
        project.getPlannedStartDate(),
        project.getPlannedDueDate(),
        project.getActualStartDate(),
        project.getActualCompletionDate(),
        project.getCreatedAt(),
        project.getUpdatedAt(),
        project.getLastActivityAt(),
        project.getStatusChangedAt(),
        project.getDeletedAt(),
        isDeleted);
  }

  /**
   * Returns the user by email
   */
  private UserEntity getUserByEmail(String email) {
    return userRepository.findByEmail(email)
        .orElseThrow(() -> new ResourceNotFoundException("User not found"));
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
  private TeamMemberEntity requireActiveMembership(UUID teamId, UUID userId) {
    TeamMemberEntity member = teamMemberRepository
        .findByTeamIdAndUserId(teamId, userId)
        .orElseThrow(() -> new ForbiddenException("User is not a team member"));
    if (member.getTeam().getDeletedAt() != null) {
      throw new ConflictException("Team is deleted and cannot be changed");
    }
    return member;
  }

  /**
   * Get an active project
   */
  private ProjectEntity requireActiveProject(UUID projectId, UUID teamId) {
    return projectRepository
        .findByIdAndTeamIdAndDeletedAtIsNull(projectId, teamId)
        .orElseThrow(() -> new ResourceNotFoundException("Project not found"));
  }

  /**
   * Get an existing project
   */
  private ProjectEntity requireProject(UUID projectId, UUID teamId) {
    return projectRepository.findByIdAndTeamId(projectId, teamId)
        .orElseThrow(() -> new ResourceNotFoundException("Project not found"));
  }

  /**
   * Ensures:
   * - User is Team member
   * - Role is Team OWNER or ADMIN
   */
  private TeamMemberEntity requireManagerMembership(UUID teamId, UUID userId) {
    TeamMemberEntity member = requireActiveMembership(teamId, userId);

    if (!canManageTeam(member)) {
      throw new ForbiddenException("Insufficient permissions");
    }

    return member;
  }

  /**
   * Ensures:
   * - Project status cannot be changed to its current value
   * All transitions between ACTIVE, ON_HOLD, COMPLETED are allowed
   */
  private void validateStatusChange(
      ProjectEntity project,
      ProjectStatus newStatus) {

    if (newStatus == null) {
      throw new BadRequestInputException("Project status is required");
    }

    if (newStatus == ProjectStatus.DELETED) {
      throw new BadRequestInputException("Use the delete endpoint to delete a project");
    }

    if (project.getStatus() == newStatus) {
      throw new ConflictException(
          "Project is already in this status");
    }
  }

  private TeamEntity requireTeam(UUID teamId) {
    return teamRepository.findById(teamId)
        .orElseThrow(() -> new ResourceNotFoundException("Team not found"));
  }

  private boolean hasGlobalAdminAuthority(Authentication authentication) {
    return authentication.getAuthorities()
        .stream()
        .anyMatch(a -> a.getAuthority().equals("ROLE_SUPER_ADMIN") || a.getAuthority().equals("ROLE_ADMIN"));
  }

  private void ensureCanReadProject(ProjectEntity project, UUID requesterId, boolean isGlobalAdmin) {
    if (isGlobalAdmin) {
      return;
    }

    UUID teamId = project.getTeam().getId();
    TeamMemberEntity membership = teamMemberRepository.findByTeamIdAndUserId(teamId, requesterId)
        .orElseThrow(() -> new ResourceNotFoundException("Project not found"));

    boolean deleted = project.getDeletedAt() != null || project.getTeam().getDeletedAt() != null;
    if (deleted && !canManageTeam(membership)) {
      throw new ResourceNotFoundException("Project not found");
    }
  }

  private boolean canManageTeam(TeamMemberEntity member) {
    return TEAM_MANAGEMENT_ROLES.contains(member.getRole());
  }

  private boolean canViewDeletedProjects(TeamEntity team, UUID requesterId, boolean isGlobalAdmin) {
    if (isGlobalAdmin) {
      return true;
    }

    TeamMemberEntity membership = teamMemberRepository.findByTeamIdAndUserId(team.getId(), requesterId)
        .orElseThrow(() -> new ResourceNotFoundException("Team not found"));

    boolean canManageTeam = canManageTeam(membership);
    if (team.getDeletedAt() != null && !canManageTeam) {
      throw new ResourceNotFoundException("Team not found");
    }

    return canManageTeam;
  }

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

  private ActivityEventDetails buildProjectActivityDetails(
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

  private ProjectDetailsUpdateMessage buildProjectUpdateMessage(
      String previousName,
      String previousDescription,
      Instant previousPlannedStart,
      Instant previousPlannedDue,
      String newName,
      String newDescription,
      Instant newPlannedStart,
      Instant newPlannedDue) {

    List<String> fields = new ArrayList<>();
    List<ActivityEventDetails.ActivityChange> changes = new ArrayList<>();

    if (!Objects.equals(previousName, newName)) {
      fields.add("name");
      changes.add(activityEventService.change("name", "name", previousName, newName));
    }

    if (!Objects.equals(previousDescription, newDescription)) {
      fields.add("description");
      changes.add(activityEventService.change("description", "description", previousDescription, newDescription));
    }

    if (!Objects.equals(previousPlannedStart, newPlannedStart)) {
      fields.add("planned start");
      changes.add(activityEventService.change("plannedStartDate", "planned start", previousPlannedStart,
          newPlannedStart));
    }

    if (!Objects.equals(previousPlannedDue, newPlannedDue)) {
      fields.add("planned due");
      changes.add(activityEventService.change("plannedDueDate", "planned due", previousPlannedDue, newPlannedDue));
    }

    if (fields.isEmpty()) {
      return new ProjectDetailsUpdateMessage("Project updated", List.of(), List.of());
    }

    return new ProjectDetailsUpdateMessage(
        "Project updated: " + String.join(", ", fields),
        fields,
        changes);
  }

  /**
   * Checks if a Project Name is unique for an active project
   */
  private String normalizeProjectName(String name) {
    return name.trim().toLowerCase(Locale.ROOT);
  }

  private void validateExistByTeamAndName(UUID teamId, String name) {

    boolean project = projectRepository.existsByTeamIdAndNameIgnoreCaseAndDeletedAtIsNull(teamId, name);

    if (project) {
      throw new ConflictException("Project name already exists for Team");
    }
  }

  private record ProjectDetailsUpdateMessage(
      String message,
      List<String> fields,
      List<ActivityEventDetails.ActivityChange> changes) {
  }

  private void validateDates(Instant start, Instant due) {
    if (start != null && due != null && due.isBefore(start)) {
      throw new ConflictException("Project due date must be after start date");
    }
  }

}
