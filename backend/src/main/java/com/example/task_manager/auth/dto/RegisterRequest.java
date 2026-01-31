package com.example.task_manager.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
                @NotBlank @Email String email,
                @NotBlank String firstName,
                @NotBlank String lastName,
                @NotBlank @Size(min = 8, message = "Password should be at least 8 characters") @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*()_+\\-\\[\\]{};':\"\\\\|,.<>/?]).{8,}$", message = "Password must contain upper, lower, digit, and special character") String password) {
}