package com.example.task_manager.exception.api;

import org.springframework.http.HttpStatus;

import com.example.task_manager.exception.ErrorResponse.ErrorCode;

/**
 * Thrown when an email is already in use.
 */
public class EmailAlreadyInUseException extends ApiException {

  public EmailAlreadyInUseException() {
    super(
        HttpStatus.CONFLICT,
        ErrorCode.EMAIL_ALREADY_EXISTS,
        "Email is already in use");
  }
}
