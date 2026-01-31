package com.example.task_manager.exception.api;

import org.springframework.http.HttpStatus;

import com.example.task_manager.exception.ErrorResponse.ErrorCode;

/**
 * Thrown when authentication fails.
 */
public class AuthException extends ApiException {
  public AuthException() {
    super(
        HttpStatus.UNAUTHORIZED,
        ErrorCode.INVALID_CREDENTIALS,
        "Invalid Credentials");
  }
}
