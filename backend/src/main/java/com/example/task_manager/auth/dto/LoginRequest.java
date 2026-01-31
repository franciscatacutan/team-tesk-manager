package com.example.task_manager.auth.dto;

import jakarta.validation.constraints.*;

public record LoginRequest(
                @NotBlank @Email String email,
                @NotBlank @Size(min = 8, message = "Password should be at least 8 characters") @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*()_+\\-\\[\\]{};':\"\\\\|,.<>/?]).{8,}$", message = "Password must contain upper, lower, digit, and special character") String password) {
}
