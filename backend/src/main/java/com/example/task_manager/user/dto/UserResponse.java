package com.example.task_manager.user.dto;

import java.util.UUID;

/* 
* Data Transfer Object for user responses.
 */
public record UserResponse(
        UUID id,
        String firstName,
        String lastName,
        String email) {
}
