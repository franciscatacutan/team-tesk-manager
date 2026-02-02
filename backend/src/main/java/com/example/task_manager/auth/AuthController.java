package com.example.task_manager.auth;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.task_manager.auth.dto.*;

import jakarta.validation.Valid;
import lombok.*;

/**
 * Handles Authentication operations.
 */

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

  private final AuthService authService;

  /**
   * Test endpoint to verify auth controller is working.
   */
  @GetMapping("/test")
  public String test() {
    return "TESTING AUTH CONNECTION SUCCESSFUL";
  }

  /**
   * Registers a new user.
   */
  @PostMapping("/register")
  public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
    return ResponseEntity.ok(authService.register(request));
  }

  /**
   * Logs in an existing user.
   */
  @PostMapping("/login")
  public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
    return ResponseEntity.ok(authService.login(request));
  }
}
