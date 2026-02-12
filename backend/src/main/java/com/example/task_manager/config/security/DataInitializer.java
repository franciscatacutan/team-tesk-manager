package com.example.task_manager.config.security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.example.task_manager.user.UserRepository;
import com.example.task_manager.user.entity.UserEntity;
import com.example.task_manager.user.entity.UserRole;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Initializes system-level data at application startup.
 *
 * Responsibilities:
 * - Creates a bootstrap SUPER_ADMIN if one does not exist.
 * - Ensures idempotent execution.
 * - Prevents accidental duplicate creation.
 *
 * This is intended for initial system provisioning only.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;

  @Value("${app.bootstrap-admin.email}")
  private String email;

  @Value("${app.bootstrap-admin.password}")
  private String password;

  @Override
  @Transactional
  public void run(String... args) {

    if (!isBootstrapConfigured()) {
      log.warn("Bootstrap admin credentials not configured. Skipping admin initialization.");
      return;
    }

    if (userRepository.existsByEmail(email)) {
      log.info("Bootstrap SUPER_ADMIN already exists. Skipping creation.");
      return;
    }

    UserEntity admin = new UserEntity();
    admin.setFirstName("System");
    admin.setLastName("Administrator");
    admin.setEmail(email);
    admin.setPassword(passwordEncoder.encode(password));
    admin.setRole(UserRole.SUPER_ADMIN);

    userRepository.save(admin);

    log.info("Bootstrap SUPER_ADMIN account created successfully.");
  }

  /**
   * Ensures bootstrap credentials are present.
   */
  private boolean isBootstrapConfigured() {
    return email != null && !email.isBlank()
        && password != null && !password.isBlank();
  }
}