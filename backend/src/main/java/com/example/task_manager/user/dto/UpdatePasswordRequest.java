package com.example.task_manager.user.dto;

import jakarta.validation.constraints.NotBlank;

/*
* DTO for updating user password
*/
public record UpdatePasswordRequest(
    @NotBlank String currentPassword,
    @NotBlank String newPassword) {
}
