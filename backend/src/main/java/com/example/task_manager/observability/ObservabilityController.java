package com.example.task_manager.observability;

import java.util.UUID;

import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.task_manager.common.PageResponse;
import com.example.task_manager.observability.dto.AuditLogResponse;
import com.example.task_manager.observability.dto.ProjectInsightsResponse;
import com.example.task_manager.observability.dto.SystemEventResponse;
import com.example.task_manager.observability.dto.TeamInsightsResponse;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/teams/{teamId}/insights")
@RequiredArgsConstructor
public class ObservabilityController {
  private final ObservabilityService observabilityService;

  @GetMapping("/summary")
  public ResponseEntity<TeamInsightsResponse> getTeamInsights(
      @PathVariable UUID teamId,
      Authentication authentication) {

    return ResponseEntity.ok(observabilityService.getTeamInsights(teamId, authentication));
  }

  @GetMapping("/audit-logs")
  public ResponseEntity<PageResponse<AuditLogResponse>> getAuditLogs(
      @PathVariable UUID teamId,
      @PageableDefault(size = 20, sort = "occurredAt", direction = Sort.Direction.DESC) Pageable pageable,
      Authentication authentication) {

    return ResponseEntity.ok(observabilityService.getAuditLogs(teamId, pageable, authentication));
  }

  @GetMapping("/system-events")
  public ResponseEntity<PageResponse<SystemEventResponse>> getSystemEvents(
      @PathVariable UUID teamId,
      @PageableDefault(size = 20, sort = "occurredAt", direction = Sort.Direction.DESC) Pageable pageable,
      Authentication authentication) {

    return ResponseEntity.ok(observabilityService.getSystemEvents(teamId, pageable, authentication));
  }

  @GetMapping("/projects/{projectId}/summary")
  public ResponseEntity<ProjectInsightsResponse> getProjectInsights(
      @PathVariable UUID teamId,
      @PathVariable UUID projectId,
      Authentication authentication) {

    return ResponseEntity.ok(observabilityService.getProjectInsights(teamId, projectId, authentication));
  }

  @GetMapping("/projects/{projectId}/audit-logs")
  public ResponseEntity<PageResponse<AuditLogResponse>> getProjectAuditLogs(
      @PathVariable UUID teamId,
      @PathVariable UUID projectId,
      @PageableDefault(size = 20, sort = "occurredAt", direction = Sort.Direction.DESC) Pageable pageable,
      Authentication authentication) {

    return ResponseEntity.ok(observabilityService.getProjectAuditLogs(teamId, projectId, pageable, authentication));
  }

  @GetMapping("/projects/{projectId}/system-events")
  public ResponseEntity<PageResponse<SystemEventResponse>> getProjectSystemEvents(
      @PathVariable UUID teamId,
      @PathVariable UUID projectId,
      @PageableDefault(size = 20, sort = "occurredAt", direction = Sort.Direction.DESC) Pageable pageable,
      Authentication authentication) {

    return ResponseEntity.ok(observabilityService.getProjectSystemEvents(teamId, projectId, pageable, authentication));
  }
}
