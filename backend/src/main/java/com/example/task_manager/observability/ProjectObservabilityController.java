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

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/teams/{teamId}/projects/{projectId}/insights")
@RequiredArgsConstructor
public class ProjectObservabilityController {
  private final ObservabilityService observabilityService;

  @GetMapping("/summary")
  public ResponseEntity<ProjectInsightsResponse> getProjectInsights(
      @PathVariable UUID teamId,
      @PathVariable UUID projectId,
      Authentication authentication) {

    return ResponseEntity.ok(observabilityService.getProjectInsights(teamId, projectId, authentication));
  }

  @GetMapping("/audit-logs")
  public ResponseEntity<PageResponse<AuditLogResponse>> getProjectAuditLogs(
      @PathVariable UUID teamId,
      @PathVariable UUID projectId,
      @PageableDefault(size = 20, sort = "occurredAt", direction = Sort.Direction.DESC) Pageable pageable,
      Authentication authentication) {

    return ResponseEntity.ok(observabilityService.getProjectAuditLogs(teamId, projectId, pageable, authentication));
  }

  @GetMapping("/system-events")
  public ResponseEntity<PageResponse<SystemEventResponse>> getProjectSystemEvents(
      @PathVariable UUID teamId,
      @PathVariable UUID projectId,
      @PageableDefault(size = 20, sort = "occurredAt", direction = Sort.Direction.DESC) Pageable pageable,
      Authentication authentication) {

    return ResponseEntity.ok(observabilityService.getProjectSystemEvents(teamId, projectId, pageable, authentication));
  }
}
