package com.example.task_manager.team;

import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.task_manager.common.PageResponse;
import com.example.task_manager.team.dto.AddTeamMemberRequest;
import com.example.task_manager.team.dto.ChangeTeamRoleRequest;
import com.example.task_manager.team.dto.CreateTeamRequest;
import com.example.task_manager.team.dto.TeamMemberResponse;
import com.example.task_manager.team.dto.TeamResponse;
import com.example.task_manager.team.dto.TeamSearchRequest;
import com.example.task_manager.team.dto.UpdateTeamRequest;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

/**
 * REST controller for managing teams.
 */
@RestController
@RequestMapping("/api/teams")
@RequiredArgsConstructor
public class TeamController {

  private final TeamService teamService;

  /**
   * Create new team.
   */
  @PostMapping
  public ResponseEntity<TeamResponse> create(
      @Valid @RequestBody CreateTeamRequest request,
      Authentication authentication) {
    return ResponseEntity.status(HttpStatus.CREATED).body(teamService.createTeam(request, authentication.getName()));
  }

  /**
   * Update team info.
   */
  @PatchMapping("/{teamId}")
  public ResponseEntity<TeamResponse> updateTeam(
      @PathVariable UUID teamId,
      @Valid @RequestBody UpdateTeamRequest request,
      Authentication authentication) {
    return ResponseEntity.ok(teamService.updateTeam(teamId, request, authentication.getName()));
  }

  /**
   * Soft delete a team.
   */
  @DeleteMapping("/{teamId}")
  public ResponseEntity<Void> deleteTeam(
      @PathVariable UUID teamId,
      Authentication authentication) {
    teamService.deleteTeam(teamId, authentication.getName());
    return ResponseEntity.noContent().build();
  }

  /**
   * Add members in a team.
   */
  @PostMapping("/{teamId}/members")
  public ResponseEntity<TeamMemberResponse> addMember(
      @PathVariable UUID teamId,
      @Valid @RequestBody AddTeamMemberRequest request,
      Authentication authentication) {
    return ResponseEntity.status(HttpStatus.CREATED)
        .body(teamService.addMember(teamId, request, authentication.getName()));
  }

  /**
   * Remove a member of a team.
   */
  @DeleteMapping("/{teamId}/members/{userId}")
  public ResponseEntity<Void> removeMember(
      @PathVariable UUID teamId,
      @PathVariable UUID userId,
      Authentication authentication) {
    teamService.removeMember(teamId, userId, authentication.getName());
    return ResponseEntity.noContent().build();
  }

  /**
   * Transfer ownership of a team.
   */
  @PatchMapping("/{teamId}/transfer/{userId}")
  public ResponseEntity<TeamMemberResponse> transferOwnership(
      @PathVariable UUID teamId,
      @PathVariable UUID userId,
      Authentication authentication) {
    return ResponseEntity.ok(teamService.transferOwnership(teamId, userId, authentication.getName()));
  }

  /**
   * Change role of user
   */
  @PatchMapping("/{teamId}/members/{userId}/role")
  public ResponseEntity<TeamMemberResponse> changeTeamRole(
      @PathVariable UUID teamId,
      @PathVariable UUID userId,
      @Valid @RequestBody ChangeTeamRoleRequest request,
      Authentication authentication) {
    return ResponseEntity.ok(teamService.changeTeamRole(teamId, userId, request.role(), authentication.getName()));
  }

  /**
   * Retrieves teams with support for:
   * - Search
   * - Filtering
   * - Sorting
   * - Pagination
   * - Role-based soft-delete visibility
   *
   * Default behavior:
   * - Returns only active (non-deleted) teams.
   *
   * Global Admins users may include deleted records using:
   * ?includeDeleted=true
   */
  @GetMapping
  public ResponseEntity<PageResponse<TeamResponse>> getTeams(
      TeamSearchRequest request,
      @PageableDefault(page = 0, size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable,
      Authentication authentication) {

    return ResponseEntity.ok(teamService.getTeams(request, pageable, authentication));
  }

  /**
   * Get Active team by ID.
   */
  @GetMapping("/{teamId}")
  public ResponseEntity<TeamResponse> getActiveTeamById(
      @PathVariable UUID teamId,
      Authentication authentication) {

    return ResponseEntity.ok(teamService.getActiveTeamById(teamId, authentication.getName()));
  }

  /**
   * Get Existing team by ID.
   */
  @GetMapping("/{teamId}/existing")
  public ResponseEntity<TeamResponse> getExistingTeamById(
      @PathVariable UUID teamId,
      Authentication authentication) {

    return ResponseEntity.ok(teamService.getExistingTeamById(teamId, authentication.getName()));
  }

  @GetMapping("/{teamId}/members")
  public ResponseEntity<List<TeamMemberResponse>> getTeamMembers(
      @PathVariable UUID teamId,
      Authentication authentication) {
    return ResponseEntity.ok(teamService.getTeamMembers(teamId, authentication.getName()));
  }
}
