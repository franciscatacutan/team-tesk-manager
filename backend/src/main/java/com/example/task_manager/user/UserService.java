package com.example.task_manager.user;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.task_manager.exception.api.BadRequestInputException;
import com.example.task_manager.exception.api.ConflictException;
import com.example.task_manager.exception.api.ForbiddenException;
import com.example.task_manager.exception.api.ResourceNotFoundException;
import com.example.task_manager.exception.api.UserNotFoundException;
import com.example.task_manager.user.dto.UpdatePasswordRequest;
import com.example.task_manager.user.dto.UpdateUserProfileRequest;
import com.example.task_manager.user.dto.UpdateUserRoleRequest;
import com.example.task_manager.user.dto.UserResponse;
import com.example.task_manager.user.entity.UserEntity;
import com.example.task_manager.user.entity.UserRole;

import lombok.RequiredArgsConstructor;

/* 
* Service layer for managing users.
 */
@Service
@RequiredArgsConstructor
public class UserService {

  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;

  /*
   * Fetch all User
   */
  @Transactional(readOnly = true)
  public List<UserResponse> getAllUsers() {

    return userRepository.findAll()
        .stream()
        .map(user -> new UserResponse(
            user.getId(),
            user.getFirstName(),
            user.getLastName(),
            user.getEmail()))
        .collect(Collectors.toList());
  }

  /*
   * Update role for users
   * Only super user can update roles
   */
  @PreAuthorize("hasRole('SUPER_ADMIN')")
  @Transactional
  public void updateUserRole(UUID targetUserId, UpdateUserRoleRequest request, String requester) {

    UserEntity currentUser = userRepository.findByEmail(requester)
        .orElseThrow(UserNotFoundException::new);

    UserEntity targetUser = userRepository.findById(targetUserId)
        .orElseThrow(UserNotFoundException::new);

    // Prevent self-demotion of the only SUPER_ADMIN (optional advanced safety)
    if (currentUser.getId().equals(targetUserId) && request.role() != UserRole.SUPER_ADMIN) {
      throw new ForbiddenException("SUPER ADMIN cannot demote themselves.");
    }

    targetUser.setRole(request.role());
  }

  /*
   * Update profile for users
   * User and Super Admin can update profile
   */
  @PreAuthorize("#userId == authentication.principal.id or hasRole('SUPER_ADMIN')")
  @Transactional
  public UserResponse updateProfile(
      UUID userId,
      UpdateUserProfileRequest request) {

    UserEntity user = userRepository.findById(userId)
        .orElseThrow(() -> new ResourceNotFoundException("User not found"));

    if (request.firstName() != null) {
      user.setFirstName(request.firstName());
    }

    if (request.lastName() != null) {
      user.setLastName(request.lastName());
    }

    if (request.email() != null) {
      if (userRepository.existsByEmail(request.email())) {
        throw new ConflictException("Email already exists");
      }
      user.setEmail(request.email());
    }

    return mapToResponse(user);
  }

  /*
   * Update profile for users
   * User and Super Admin can update profile
   */
  @PreAuthorize("#userId == authentication.principal.id or hasRole('SUPER_ADMIN')")
  @Transactional
  public Void updatePassword(
      UUID userId,
      UpdatePasswordRequest request) {

    UserEntity target = userRepository.findById(userId)
        .orElseThrow(() -> new ResourceNotFoundException("User not found"));

    if (!passwordEncoder.matches(request.currentPassword(),
        target.getPassword())) {
      throw new BadRequestInputException("Current password incorrect");
    }

    target.setPassword(passwordEncoder.encode(request.newPassword()));

    return null;
  }

  // HELPER
  private UserResponse mapToResponse(UserEntity user) {
    return new UserResponse(
        user.getId(),
        user.getFirstName(),
        user.getLastName(),
        user.getEmail());
  }

}