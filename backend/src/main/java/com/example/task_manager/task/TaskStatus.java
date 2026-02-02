package com.example.task_manager.task;

import com.fasterxml.jackson.annotation.JsonCreator;

/**
 * Enum representing the status of a task.
 */
public enum TaskStatus {
    TODO,
    IN_PROGRESS,
    DONE;

    // Converts a string to a TaskStatus enum, ignoring case
    @JsonCreator
    public static TaskStatus from(String value) {
        return TaskStatus.valueOf(value.toUpperCase());
    }
}
