package com.example.task_manager.user.dto;

/*
* DTO for updating user information
*/
public record UpdateUserProfileRequest(
    String firstName,
    String lastName,
    String email) {
}