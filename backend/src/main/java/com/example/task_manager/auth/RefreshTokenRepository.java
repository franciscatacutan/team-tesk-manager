package com.example.task_manager.auth;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.task_manager.auth.entity.RefreshTokenEntity;

public interface RefreshTokenRepository extends JpaRepository<RefreshTokenEntity, UUID> {

  Optional<RefreshTokenEntity> findByTokenHash(String tokenHash);

  List<RefreshTokenEntity> findAllByFamilyIdAndRevokedAtIsNull(UUID familyId);

  List<RefreshTokenEntity> findAllByUser_IdAndRevokedAtIsNull(UUID userId);
}
