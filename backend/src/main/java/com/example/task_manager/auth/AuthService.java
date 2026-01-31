package com.example.task_manager.auth;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.task_manager.auth.dto.AuthResponse;
import com.example.task_manager.auth.dto.LoginRequest;
import com.example.task_manager.auth.dto.RegisterRequest;
import com.example.task_manager.exception.api.AuthException;
import com.example.task_manager.exception.api.EmailAlreadyInUseException;
import com.example.task_manager.security.JwtService;
import com.example.task_manager.user.UserEntity;
import com.example.task_manager.user.UserRepo;
import com.example.task_manager.user.UserRole;

import lombok.RequiredArgsConstructor;

/**
 * Contains business logic for managing authentication.
 */
@Service
@RequiredArgsConstructor
public class AuthService {

  private final UserRepo userRepository;
  private final PasswordEncoder passwordEncoder;
  private final JwtService jwtService;

  /**
   * Registers a new user.
   */
  public AuthResponse register(RegisterRequest request) {

    // Check if email is already in use
    if (userRepository.existsByEmail(request.email())) {
      throw new EmailAlreadyInUseException();
    }

    UserEntity user = new UserEntity();
    user.setFirstName(request.firstName());
    user.setLastName(request.lastName());
    user.setEmail(request.email());
    user.setRole(UserRole.USER);
    user.setPassword(
        passwordEncoder.encode(request.password()));

    // Save user and handle potential email uniqueness violation
    try {
      user = userRepository.save(user);
    } catch (DataIntegrityViolationException ex) {
      throw new EmailAlreadyInUseException();
    }

    String token = jwtService.generateToken(user);

    return new AuthResponse(token);
  }

  /**
   * Logs in an existing user.
   */
  public AuthResponse login(LoginRequest request) {

    // Find user by email for authentication
    UserEntity user = userRepository.findByEmail(request.email())
        .orElseThrow(() -> new AuthException());

    // Verify password
    if (!passwordEncoder.matches(
        request.password(),
        user.getPassword())) {
      throw new AuthException();
    }

    String token = jwtService.generateToken(user);

    return new AuthResponse(token);
  }
}
