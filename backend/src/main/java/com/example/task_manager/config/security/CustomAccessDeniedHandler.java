package com.example.task_manager.config.security;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import tools.jackson.databind.ObjectMapper;

import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.stereotype.Component;

import com.example.task_manager.exception.ErrorResponse;

import java.io.IOException;
import java.time.Instant;

/*
* Exception for Global Role Access
*/
@Component
public class CustomAccessDeniedHandler implements AccessDeniedHandler {

  private final ObjectMapper objectMapper;

  public CustomAccessDeniedHandler(ObjectMapper objectMapper) {
    this.objectMapper = objectMapper;
  }

  @Override
  public void handle(HttpServletRequest request,
      HttpServletResponse response,
      AccessDeniedException ex) throws IOException {

    ErrorResponse error = new ErrorResponse(
        HttpStatus.FORBIDDEN.value(),
        ErrorResponse.ErrorCode.FORBIDDEN,
        "You do not have permission to perform this action.",
        request.getRequestURI(),
        Instant.now());

    response.setStatus(HttpServletResponse.SC_FORBIDDEN);
    response.setContentType("application/json");

    objectMapper.writeValue(response.getOutputStream(), error);
  }
}