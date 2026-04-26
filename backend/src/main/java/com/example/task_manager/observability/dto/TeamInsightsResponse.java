package com.example.task_manager.observability.dto;

import java.time.Instant;
import java.util.UUID;

public record TeamInsightsResponse(
    UUID teamId,
    Instant generatedAt,
    TaskMetrics tasks,
    ProjectMetrics projects,
    FlowMetrics flow,
    ActivityMetrics activity) {

  public record TaskMetrics(
      long total,
      long todo,
      long inProgress,
      long inReview,
      long onHold,
      long done,
      long cancelled,
      long overdue,
      long highPriority,
      long criticalPriority) {
  }

  public record ProjectMetrics(
      long total,
      long active,
      long onHold,
      long completed) {
  }

  public record FlowMetrics(
      long completedLast7Days,
      double completionRatePercent,
      double averageCycleTimeHours) {
  }

  public record ActivityMetrics(
      long activityEventsLast7Days,
      long auditEventsLast7Days,
      long systemEventsLast7Days) {
  }
}
