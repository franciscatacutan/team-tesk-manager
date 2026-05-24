package com.example.task_manager.user;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import com.example.task_manager.user.entity.UserEntity;

/**
 * Repository interface for User entities.
 */
public interface UserRepository extends JpaRepository<UserEntity, UUID>, JpaSpecificationExecutor<UserEntity> {
  Optional<UserEntity> findByEmail(String email);

  boolean existsByEmail(String email);

  Optional<UserEntity> findByEmailIgnoreCase(String email);

  boolean existsByEmailIgnoreCase(String email);

  boolean existsById(UUID id);

}
