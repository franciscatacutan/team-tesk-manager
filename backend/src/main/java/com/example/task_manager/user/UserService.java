package com.example.task_manager.user;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.task_manager.exception.api.UnauthorizedException;
import com.example.task_manager.exception.api.UserNotFoundException;
import com.example.task_manager.user.dto.UserResponse;
import com.example.task_manager.user.entity.UserEntity;
import com.example.task_manager.user.entity.UserRole;

/* 
* Service layer for managing users.
 */
@Service
public class UserService {

  private final UserRepository userRepository;

  public UserService(UserRepository userRepository) {
    this.userRepository = userRepository;
  }

  // Get all users in the system.
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
  @Transactional
  public void updateUserRole(UUID targetUserId, UserRole newRole, UUID currentUserId) {

    UserEntity currentUser = userRepository.findById(currentUserId)
        .orElseThrow(UserNotFoundException::new);

    if (currentUser.getRole() != UserRole.SUPER_ADMIN) {
      throw new UnauthorizedException();
    }

    UserEntity targetUser = userRepository.findById(targetUserId)
        .orElseThrow(UserNotFoundException::new);

    // Prevent self-demotion of the only SUPER_ADMIN (optional advanced safety)
    if (currentUserId.equals(targetUserId) && newRole != UserRole.SUPER_ADMIN) {
      throw new IllegalStateException("SUPER_ADMIN cannot demote themselves.");
    }

    targetUser.setRole(newRole);
  }

}