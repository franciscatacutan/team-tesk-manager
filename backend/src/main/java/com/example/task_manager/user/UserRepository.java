package com.example.task_manager.user;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.task_manager.user.entity.UserEntity;

/**
 * Repository interface for User entities.
 */
public interface UserRepository extends JpaRepository<UserEntity, Long> {
  Optional<UserEntity> findByEmail(String email);

  boolean existsByEmail(String email);
}
