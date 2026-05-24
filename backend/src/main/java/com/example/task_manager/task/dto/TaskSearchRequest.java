package com.example.task_manager.task.dto;

import java.util.List;
import java.util.UUID;

import com.example.task_manager.common.DeletedFilter;
import com.example.task_manager.task.entity.TaskPriority;
import com.example.task_manager.task.entity.TaskStatus;

/*
* DTO for fetching task with search, filtering and sort
*/
public record TaskSearchRequest(
    String search,
    List<TaskStatus> status,
    List<TaskPriority> priority,
    UUID assigneeId,
    UUID supportId,
    Boolean overdue,
    DeletedFilter deletedFilter) {

  public DeletedFilter deletedFilter() {
    return deletedFilter == null ? DeletedFilter.ACTIVE : deletedFilter;
  }
}
