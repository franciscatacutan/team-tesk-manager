package com.example.task_manager.exception.api;

import org.springframework.http.HttpStatus;

import com.example.task_manager.exception.ErrorResponse.ErrorCode;

/**
 * Thrown when a request contains invalid or malformed input.
 */
public class BadRequestInputException extends ApiException {

  private static final String DEFAULT_MESSAGE = "Invalid request input";

  public BadRequestInputException() {
    this(null);
  }

  public BadRequestInputException(String message) {
    super(HttpStatus.BAD_REQUEST,
        ErrorCode.BAD_REQUEST,
        message == null || message.isBlank()
            ? DEFAULT_MESSAGE
            : message);
  }
}