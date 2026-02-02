package com.example.task_manager.user.dto;

/* 
* Data Transfer Object for user responses.
 */
public record UserResponse(
    Long id,
    String firstName,
    String lastName,
    String email) {
}
