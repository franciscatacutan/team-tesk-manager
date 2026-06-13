package com.example.task_manager.exception.api;

import org.springframework.http.HttpStatus;

import com.example.task_manager.exception.ErrorResponse.ErrorCode;

/**
 * Thrown when a user is not able to perform an action.
 */
public class ForbiddenException extends ApiException {

  private static final String DEFAULT_MESSAGE = "Access is forbidden";

  public ForbiddenException() {
    this(null);
  }

  public ForbiddenException(String message) {
    super(HttpStatus.FORBIDDEN,
        ErrorCode.FORBIDDEN,
        message == null || message.isBlank()
            ? DEFAULT_MESSAGE
            : message);
  }
}
