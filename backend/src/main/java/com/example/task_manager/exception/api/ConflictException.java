package com.example.task_manager.exception.api;

import org.springframework.http.HttpStatus;

import com.example.task_manager.exception.ErrorResponse.ErrorCode;

/**
 * Thrown when a request conflicts with other resources
 */
public class ConflictException extends ApiException {

  private static final String DEFAULT_MESSAGE = "Request conflicts with current resource state";

  public ConflictException() {
    this(null);
  }

  public ConflictException(String message) {
    super(HttpStatus.CONFLICT,
        ErrorCode.CONFLICT,
        message == null || message.isBlank()
            ? DEFAULT_MESSAGE
            : message);
  }
}
