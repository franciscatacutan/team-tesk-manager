package com.example.task_manager.config.security;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.example.task_manager.user.UserRepository;
import com.example.task_manager.user.entity.UserEntity;

import lombok.RequiredArgsConstructor;

/**
 * Custom UserDetailsService implementation for loading user details from the
 * database.
 */
@Service
@RequiredArgsConstructor
public class CustomUserDetailsService
    implements UserDetailsService {

  private final UserRepository userRepository;

  /**
   * Loads user details by email.
   */
  @Override
  public UserDetails loadUserByUsername(String email)
      throws UsernameNotFoundException {

    // Load user from the database
    UserEntity user = userRepository.findByEmail(email)
        .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    return new CustomUserPrincipal(user);

  }
}