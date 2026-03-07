package com.example.task_manager.user;

import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.task_manager.user.dto.UpdateUserRoleRequest;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

/**
 * Administrative endpoints for managing users.
 */
@RestController
@RequestMapping("/api/admin/users")
@RequiredArgsConstructor
public class AdminUserController {

  private final UserService userService;

  /**
   * Updates the role of a specific user.
   *
   * Only SUPER_ADMIN is allowed to perform this operation.
   */
  @PatchMapping("/{id}/role")
  public ResponseEntity<Void> updateUserRole(
      @PathVariable UUID id,
      @Valid @RequestBody UpdateUserRoleRequest request,
      Authentication authentication) {

    userService.updateUserRole(id, request, authentication.getName());

    return ResponseEntity.noContent().build();
  }
}
