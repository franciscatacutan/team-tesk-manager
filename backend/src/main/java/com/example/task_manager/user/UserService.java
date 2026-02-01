package com.example.task_manager.user;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.example.task_manager.user.dto.UserResponse;

/* 
* Service layer for managing users.
 */
@Service
public class UserService {

  private final UserRepo userRepository;

  public UserService(UserRepo userRepository) {
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
}