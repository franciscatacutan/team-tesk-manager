package com.example.task_manager.team;

import java.util.UUID;

import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.task_manager.common.PageResponse;
import com.example.task_manager.team.dto.AddTeamMembersRequest;
import com.example.task_manager.team.dto.AddTeamMembersResponse;
import com.example.task_manager.team.dto.ChangeTeamRoleRequest;
import com.example.task_manager.team.dto.CreateTeamRequest;
import com.example.task_manager.team.dto.RemoveTeamMembersRequest;
import com.example.task_manager.team.dto.RemoveTeamMembersResponse;
import com.example.task_manager.team.dto.TeamActivityResponse;
import com.example.task_manager.team.dto.TeamMeResponse;
import com.example.task_manager.team.dto.TeamMemberResponse;
import com.example.task_manager.team.dto.TeamMemberSearchRequest;
import com.example.task_manager.team.dto.TeamResponse;
import com.example.task_manager.team.dto.TeamSearchRequest;
import com.example.task_manager.team.dto.UpdateTeamRequest;
import com.example.task_manager.user.dto.UserResponse;

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

  @PostMapping
  public ResponseEntity<TeamResponse> create(
      @Valid @RequestBody CreateTeamRequest request,
      Authentication authentication) {
    return ResponseEntity.status(HttpStatus.CREATED).body(teamService.createTeam(request, authentication.getName()));
  }

  @PatchMapping("/{teamId}")
  public ResponseEntity<TeamResponse> updateTeam(
      @PathVariable UUID teamId,
      @Valid @RequestBody UpdateTeamRequest request,
      Authentication authentication) {
    return ResponseEntity.ok(teamService.updateTeam(teamId, request, authentication.getName()));
  }

  @DeleteMapping("/{teamId}")
  public ResponseEntity<Void> deleteTeam(
      @PathVariable UUID teamId,
      Authentication authentication) {
    teamService.deleteTeam(teamId, authentication.getName());
    return ResponseEntity.noContent().build();
  }

  @PostMapping("/{teamId}/members")
  public ResponseEntity<AddTeamMembersResponse> addMembers(
      @PathVariable UUID teamId,
      @Valid @RequestBody AddTeamMembersRequest request,
      Authentication authentication) {
    return ResponseEntity.status(HttpStatus.CREATED)
        .body(teamService.addMembers(teamId, request, authentication.getName()));
  }

  @DeleteMapping("/{teamId}/members")
  public ResponseEntity<RemoveTeamMembersResponse> removeMembers(
      @PathVariable UUID teamId,
      @Valid @RequestBody RemoveTeamMembersRequest request,
      Authentication authentication) {
    return ResponseEntity.ok(teamService.removeMembers(teamId, request, authentication.getName()));
  }

  @PatchMapping("/{teamId}/transfer/{userId}")
  public ResponseEntity<TeamMemberResponse> transferOwnership(
      @PathVariable UUID teamId,
      @PathVariable UUID userId,
      Authentication authentication) {
    return ResponseEntity.ok(teamService.transferOwnership(teamId, userId, authentication.getName()));
  }

  @PatchMapping("/{teamId}/members/{userId}/role")
  public ResponseEntity<TeamMemberResponse> changeTeamRole(
      @PathVariable UUID teamId,
      @PathVariable UUID userId,
      @Valid @RequestBody ChangeTeamRoleRequest request,
      Authentication authentication) {
    return ResponseEntity.ok(teamService.changeTeamRole(teamId, userId, request.role(), authentication.getName()));
  }

  @GetMapping
  public ResponseEntity<PageResponse<TeamResponse>> getTeams(
      @ModelAttribute TeamSearchRequest request,
      @PageableDefault(page = 0, size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable,
      Authentication authentication) {

    return ResponseEntity.ok(teamService.getTeams(request, pageable, authentication));
  }

  @GetMapping("/{teamId}")
  public ResponseEntity<TeamResponse> getTeamById(
      @PathVariable UUID teamId,
      Authentication authentication) {

    return ResponseEntity.ok(teamService.getTeamById(teamId, authentication));
  }

  @GetMapping("/{teamId}/members")
  public ResponseEntity<PageResponse<TeamMemberResponse>> getTeamMembers(
      @ModelAttribute TeamMemberSearchRequest request,
      @PathVariable UUID teamId,
      @PageableDefault(page = 0, size = 20, sort = "joinedAt", direction = Sort.Direction.DESC) Pageable pageable,
      Authentication authentication) {
    return ResponseEntity.ok(teamService.getTeamMembers(request, teamId, pageable, authentication));
  }

  @GetMapping("/{teamId}/available-users")
  public ResponseEntity<PageResponse<UserResponse>> getAvailableUsers(
      @PathVariable UUID teamId,
      @RequestParam(required = false) String search,
      @PageableDefault(page = 0, size = 20, sort = "lastName", direction = Sort.Direction.DESC) Pageable pageable,
      Authentication authentication) {
    return ResponseEntity.ok(teamService.getAvailableUsers(search, teamId, pageable, authentication));
  }

  @GetMapping("/{teamId}/me")
  public ResponseEntity<TeamMeResponse> getMyTeamRole(
      @PathVariable UUID teamId,
      Authentication authentication) {
    return ResponseEntity.ok(teamService.getMyTeamRole(teamId, authentication.getName()));
  }

  @GetMapping("/{teamId}/activities")
  public ResponseEntity<PageResponse<TeamActivityResponse>> getTeamActivities(
      @PathVariable UUID teamId,
      @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable,
      Authentication authentication) {
    return ResponseEntity.ok(teamService.getTeamActivities(teamId, pageable, authentication));
  }
}
