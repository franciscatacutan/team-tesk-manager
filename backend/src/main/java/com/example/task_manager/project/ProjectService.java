package com.example.task_manager.project;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
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
import com.example.task_manager.activity.entity.ActivityEventEntity;
import com.example.task_manager.activity.dto.ActivityEventType;
import com.example.task_manager.common.DeletedFilter;
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
import com.example.task_manager.team.entity.TeamMemberEntity;
import com.example.task_manager.team.entity.TeamRole;
import com.example.task_manager.user.UserRepository;
import com.example.task_manager.user.entity.UserEntity;

import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;

/**
 * Contains business logic for managing projects.
 */
@Service
@RequiredArgsConstructor
public class ProjectService {

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

    TeamMemberEntity requesterMembership = canManageTeamProject(teamId, requester.getId());

    String trimmedName = request.name().trim().toLowerCase(Locale.ROOT);

    validateExistByTeamAndName(teamId, trimmedName);

    ProjectEntity project = new ProjectEntity();
    project.setName(request.name().trim());
    project.setDescription(request.description());
    project.setStatus(ProjectStatus.ACTIVE);
    project.setTeam(requesterMembership.getTeam());
    project.setCreatedBy(requester);

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
            List.of("name", "description", "status"),
            null,
            null,
            null,
            List.of(
                activityEventService.change("name", "name", null, project.getName()),
                activityEventService.change("description", "description", null, project.getDescription()),
                activityEventService.change("status", "status", null, project.getStatus())),
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

    ProjectEntity project = getActiveProject(projectId, teamId);

    validateCanManageTeamProject(teamId, requester.getId());

    String previousName = project.getName();
    String previousDescription = project.getDescription();

    if (request.name() != null) {

      if (request.name().isEmpty()) {
        throw new BadRequestInputException("Project name cannot be blank");
      }
      String trimmedName = request.name().trim().toLowerCase(Locale.ROOT);

      validateExistByTeamAndName(teamId, trimmedName);

      project.setName(request.name().trim());
    }

    if (request.description() != null) {
      project.setDescription(request.description().trim());
    }
    ProjectDetailsUpdateMessage updateMessage = buildProjectUpdateMessage(
        previousName,
        previousDescription,
        project.getName(),
        project.getDescription());

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

    ProjectEntity project = getActiveProject(projectId, teamId);

    validateCanManageTeamProject(teamId, requester.getId());

    Instant now = Instant.now();
    List<TaskEntity> activeTasks = taskRepository
        .findAllByProjectIdAndDeletedAtIsNull(projectId);

    project.setDeletedAt(now);

    for (com.example.task_manager.task.entity.TaskEntity task : activeTasks) {
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

    ProjectEntity project = getExistingProject(projectId, teamId);

    validateCanManageTeamProject(teamId, requester.getId());

    validateStatusChange(project, newStatus.status());

    ProjectStatus currentStatus = project.getStatus();
    project.setStatus(newStatus.status());

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

    validateTeam(teamId);

    boolean isGlobalAdmin = authentication.getAuthorities()
        .stream()
        .anyMatch(a -> a.getAuthority().equals("ROLE_SUPER_ADMIN") || a.getAuthority().equals("ROLE_ADMIN"));

    if (!isGlobalAdmin) {
      validateMembership(teamId, requester.getId());
    }

    DeletedFilter filter = request.deletedFilter();

    if (!isGlobalAdmin && filter != DeletedFilter.ACTIVE) {
      throw new ForbiddenException("Not allowed to view deleted tasks");
    }

    pageable = validateSorting(pageable);

    Specification<ProjectEntity> spec = ProjectSpecification.build(
        teamId,
        request.search(),
        request.status(),
        request.createdBy(),
        request.deletedFilter(),
        isGlobalAdmin);

    Page<ProjectEntity> page = projectRepository.findAll(spec, pageable);

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
   * Returns an active projects by id.
   */
  @Transactional(readOnly = true)
  public ProjectResponse getActiveProjectById(
      UUID teamId,
      UUID projectId,
      String requesterEmail) {

    UserEntity requester = getUserByEmail(requesterEmail);

    ProjectEntity project = getActiveProject(projectId, teamId);

    validateMembership(teamId, requester.getId());

    return mapToResponse(project);
  }

  /**
   * Returns an existing projects by id.
   */
  @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN')")
  @Transactional(readOnly = true)
  public ProjectResponse getExistingProjectById(
      UUID teamId,
      UUID projectId,
      String requesterEmail) {

    UserEntity requester = getUserByEmail(requesterEmail);

    ProjectEntity project = getExistingProject(projectId, teamId);

    validateMembership(teamId, requester.getId());

    return mapToResponse(project);
  }

  /**
   * Returns all updates by projects.
   */
  @Transactional(readOnly = true)
  public PageResponse<ProjectActivityResponse> getProjectActivities(
      UUID projectId,
      Pageable pageable) {

    Page<ActivityEventEntity> page = activityEventRepository.findByProjectId(projectId, pageable);

    return new PageResponse<>(
        page.map(activityEventService::toProjectActivitiesResponse).getContent(),
        page.getNumber(),
        page.getSize(),
        page.getTotalElements(),
        page.getTotalPages(),
        page.isFirst(),
        page.isLast());
  }

  // ********************
  // HELPERS
  // ********************

  /**
   * Maps a ProjectEntity to a Project Response.
   */
  private ProjectResponse mapToResponse(ProjectEntity project) {
    ProjectResponse.ProjectUserSummary createdBy = new ProjectResponse.ProjectUserSummary(
        project.getCreatedBy().getId(),
        project.getCreatedBy().getFirstName(),
        project.getCreatedBy().getLastName(),
        project.getCreatedBy().getEmail());

    Boolean isDeleted = project.getDeletedAt() != null ? true : false;

    return new ProjectResponse(
        project.getId(),
        project.getName(),
        project.getDescription(),
        project.getStatus(),
        project.getTeam().getId(),
        createdBy,
        project.getCreatedAt(),
        project.getUpdatedAt(),
        project.getLastActivityAt(),
        isDeleted);
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
   * Ensures:
   * - Team exists
   * - Team not deleted
   * - Membership exists
   *
   * Returns membership entity.
   * Uses ResourceNotFound to prevent ID probing.
   */
  private TeamMemberEntity getMembership(UUID teamId, UUID userId) {
    TeamMemberEntity member = teamMemberRepository
        .findByTeamIdAndUserIdAndTeamDeletedAtIsNull(teamId, userId)
        .orElseThrow(() -> new ForbiddenException("User is not a team member"));
    return member;
  }

  /**
   * Checks if a User is member of a team
   */
  private void validateMembership(UUID teamId, UUID userId) {
    boolean isMember = teamMemberRepository
        .existsByTeamIdAndUserId(
            teamId, userId);

    if (!isMember) {
      throw new ResourceNotFoundException("Team not found or User is not a team member");
    }
  }

  /**
   * Get an active project
   */
  private ProjectEntity getActiveProject(UUID projectId, UUID teamId) {
    return projectRepository
        .findByIdAndTeamIdAndDeletedAtIsNull(projectId, teamId)
        .orElseThrow(() -> new ResourceNotFoundException("Project not found"));
  }

  /**
   * Get an existing project
   */
  private ProjectEntity getExistingProject(UUID projectId, UUID teamId) {
    return projectRepository.findByIdAndTeamId(projectId, teamId)
        .orElseThrow(() -> new ResourceNotFoundException("Project not found"));
  }

  /**
   * Ensures:
   * - User is Team member
   * - Role is Team OWNER or ADMIN
   */
  private TeamMemberEntity canManageTeamProject(UUID teamId, UUID userId) {
    TeamMemberEntity member = getMembership(teamId, userId);

    if (member.getRole() != TeamRole.OWNER &&
        member.getRole() != TeamRole.ADMIN) {
      throw new ForbiddenException("Insufficient permissions");
    }

    return member;
  }

  /**
   * Checks :
   * - User is Team member
   * - Role is Team OWNER or ADMIN
   */
  private void validateCanManageTeamProject(UUID teamId, UUID userId) {
    TeamMemberEntity member = getMembership(teamId, userId);

    if (member.getRole() != TeamRole.OWNER &&
        member.getRole() != TeamRole.ADMIN) {
      throw new ForbiddenException("Insufficient permissions");
    }
  }

  /**
   * Ensures:
   * - Project status cannot be changed to its current value
   * All transitions between ACTIVE, ON_HOLD, COMPLETED are allowed
   */
  private void validateStatusChange(
      ProjectEntity project,
      ProjectStatus newStatus) {

    if (project.getStatus() == newStatus) {
      throw new ConflictException(
          "Project is already in this status");
    }
  }

  /**
   * Get an existing team
   */
  private void validateTeam(UUID teamId) {
    boolean team = teamRepository.existsById(teamId);

    if (!team) {
      throw new ResourceNotFoundException("Team not found");
    }
  }

  /*
   * Allowed Sorting Fields
   */
  private static final Set<String> ALLOWED_SORT_FIELDS = Set.of(
      "name",
      "status",
      "createdBy",
      "lastActivityAt",
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

}
