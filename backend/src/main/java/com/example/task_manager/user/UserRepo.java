package com.example.task_manager.user;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Repository interface for User entities.
 */
public interface UserRepo extends JpaRepository<UserEntity, Long> {
  Optional<UserEntity> findByEmail(String email);

  boolean existsByEmail(String email);
}
