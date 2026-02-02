package com.example.task_manager.exception.api;

import org.springframework.http.HttpStatus;

import com.example.task_manager.exception.ErrorResponse.ErrorCode;

/**
 * Thrown when a requested resource is not found.
 */
public class ResourceNotFoundException extends ApiException {

  public ResourceNotFoundException(String message) {
    super(
        HttpStatus.NOT_FOUND,
        ErrorCode.NOT_FOUND,
        message);
  }
}