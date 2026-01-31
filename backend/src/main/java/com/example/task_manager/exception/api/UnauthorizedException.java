package com.example.task_manager.exception.api;

import org.springframework.http.HttpStatus;

import com.example.task_manager.exception.ErrorResponse.ErrorCode;

/**
 * Thrown when a user is not authorized to perform an action.
 */
public class UnauthorizedException extends ApiException {

  public UnauthorizedException() {
    super(HttpStatus.UNAUTHORIZED,
        ErrorCode.UNAUTHORIZED,
        "User is not Authorized");
  }

}