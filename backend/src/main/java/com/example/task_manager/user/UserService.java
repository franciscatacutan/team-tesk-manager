package com.example.task_manager.user;

import java.util.List;
import java.util.Locale;
import java.util.Objects;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

import org.hibernate.annotations.NotFound;
import org.springframework.data.crossstore.ChangeSetPersister.NotFoundException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.task_manager.exception.api.BadRequestInputException;
import com.example.task_manager.exception.api.ConflictException;
import com.example.task_manager.exception.api.ForbiddenException;
import com.example.task_manager.exception.api.ResourceNotFoundException;
import com.example.task_manager.exception.api.UserNotFoundException;
import com.example.task_manager.team.TeamMemberSpecification;
import com.example.task_manager.team.entity.TeamMemberEntity;
import com.example.task_manager.auth.RefreshTokenService;
import com.example.task_manager.common.PageResponse;
import com.example.task_manager.user.dto.AdminResetPasswordRequest;
import com.example.task_manager.user.dto.UpdateEmailRequest;
import com.example.task_manager.user.dto.UpdatePasswordRequest;
import com.example.task_manager.user.dto.UpdateUserProfileRequest;
import com.example.task_manager.user.dto.UpdateUserRoleRequest;
import com.example.task_manager.user.dto.UserResponse;
import com.example.task_manager.user.dto.UserSearchRequest;
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
  private final RefreshTokenService refreshTokenService;

  /*
   * Fetch all User
   */
  @Transactional(readOnly = true)
  public PageResponse<UserResponse> getAllUsers(
      UserSearchRequest request,
      Pageable pageable) {

    Specification<UserEntity> spec = UserSpecification.build(
        request.search(),
        request.roles());

    pageable = validateSorting(pageable);

    Page<UserEntity> page = userRepository.findAll(spec, pageable);

    return new PageResponse<>(
        page.map(this::mapToResponse).getContent(),
        page.getNumber(),
        page.getSize(),
        page.getTotalElements(),
        page.getTotalPages(),
        page.isFirst(),
        page.isLast());
  }

  /*
   * Fetch all User
   */
  @Transactional(readOnly = true)
  public UserResponse getUser(UUID userId) {

    UserEntity user = userRepository.findById(userId)
        .orElseThrow(UserNotFoundException::new);

    return new UserResponse(
        user.getId(),
        user.getFirstName(),
        user.getLastName(),
        user.getEmail(),
        user.getRole());
  }

  /*
   * Update role for users
   * Only super user can update roles
   */
  @PreAuthorize("hasRole('SUPER_ADMIN')")
  @Transactional
  public void updateUserRole(UUID targetUserId, UpdateUserRoleRequest request, String requester) {

    UserEntity currentUser = userRepository.findByEmailIgnoreCase(normalizeEmail(requester))
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
   * User, Admin, and Super Admin can update profile
   */
  @PreAuthorize("#userId == authentication.principal.id or hasAnyRole('ADMIN', 'SUPER_ADMIN')")
  @Transactional
  public UserResponse updateProfile(
      UUID userId,
      UpdateUserProfileRequest request,
      String requesterEmail) {

    UserEntity requester = getUserByEmail(requesterEmail);
    UserEntity user = userRepository.findById(userId)
        .orElseThrow(() -> new ResourceNotFoundException("User not found"));

    assertCanManageTargetUser(requester, user);

    if (request.firstName() != null) {
      user.setFirstName(request.firstName());
    }

    if (request.lastName() != null) {
      user.setLastName(request.lastName());
    }

    if (request.email() != null) {
      String normalizedEmail = normalizeEmail(request.email());
      if (!normalizedEmail.equalsIgnoreCase(user.getEmail())
          && userRepository.existsByEmailIgnoreCase(normalizedEmail)) {
        throw new ConflictException("Email already exists");
      }
      user.setEmail(normalizedEmail);
    }

    return mapToResponse(user);
  }

  /*
   * Update the current user's login email.
   * This requires the current password and revokes refresh sessions because JWT
   * subjects are email-based.
   */
  @Transactional
  public void updateOwnEmail(UpdateEmailRequest request, String requesterEmail) {

    UserEntity user = getUserByEmail(requesterEmail);

    if (!passwordEncoder.matches(request.currentPassword(), user.getPassword())) {
      throw new BadRequestInputException("Current password incorrect");
    }

    String normalizedEmail = normalizeEmail(request.newEmail());
    if (normalizedEmail.equalsIgnoreCase(user.getEmail())) {
      return;
    }

    if (userRepository.existsByEmailIgnoreCase(normalizedEmail)) {
      throw new ConflictException("Email already exists");
    }

    user.setEmail(normalizedEmail);
    refreshTokenService.revokeAllForUser(user.getId());
  }

  /*
   * Update profile for users
   * User and Super Admin can update their password
   */
  @PreAuthorize("#userId == authentication.principal.id or hasRole('SUPER_ADMIN')")
  @Transactional
  public void updatePassword(
      UUID userId,
      UpdatePasswordRequest request,
      String requesterEmail) {

    UserEntity requester = getUserByEmail(requesterEmail);
    UserEntity target = userRepository.findById(userId)
        .orElseThrow(() -> new ResourceNotFoundException("User not found"));

    if (!requester.getId().equals(target.getId())) {
      assertCanManageTargetUser(requester, target);
    }

    if (!passwordEncoder.matches(request.currentPassword(),
        target.getPassword())) {
      throw new BadRequestInputException("Current password incorrect");
    }

    target.setPassword(passwordEncoder.encode(request.newPassword()));
    refreshTokenService.revokeAllForUser(target.getId());

  }

  /*
   * Reset password for users
   * Admin and Super Admin can reset another user's password
   */
  @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
  @Transactional
  public void resetPasswordByAdmin(
      UUID targetUserId,
      AdminResetPasswordRequest request,
      String requesterEmail) {

    UserEntity requester = getUserByEmail(requesterEmail);
    UserEntity target = userRepository.findById(targetUserId)
        .orElseThrow(() -> new ResourceNotFoundException("User not found"));

    if (requester.getId().equals(target.getId())) {
      throw new ForbiddenException("Use the regular password change flow for your own account.");
    }

    assertCanManageTargetUser(requester, target);

    target.setPassword(passwordEncoder.encode(request.newPassword()));
    refreshTokenService.revokeAllForUser(target.getId());
  }

  public UserResponse getByEmail(String email) {
    UserEntity user = getUserByEmail(email);

    return mapToResponse(user);
  }

  private UserEntity getUserByEmail(String email) {
    return userRepository.findByEmailIgnoreCase(normalizeEmail(email))
        .orElseThrow(UserNotFoundException::new);
  }

  private void assertCanManageTargetUser(UserEntity requester, UserEntity target) {
    if (Objects.equals(requester.getId(), target.getId())) {
      return;
    }

    if (requester.getRole() == UserRole.SUPER_ADMIN) {
      return;
    }

    if (requester.getRole() == UserRole.ADMIN) {
      if (target.getRole() == UserRole.SUPER_ADMIN) {
        throw new ForbiddenException("ADMIN cannot manage SUPER_ADMIN accounts.");
      }
      return;
    }

    throw new ForbiddenException("You do not have permission to manage this user.");
  }

  // HELPER
  private UserResponse mapToResponse(UserEntity user) {
    return new UserResponse(
        user.getId(),
        user.getFirstName(),
        user.getLastName(),
        user.getEmail(),
        user.getRole());
  }

  private String normalizeEmail(String email) {
    return email.trim().toLowerCase(Locale.ROOT);
  }

  /*
   * Allowed Sorting Fields
   */
  private static final Set<String> ALLOWED_SORT_FIELDS = Set.of(
      "firstName",
      "email",
      "lastName",
      "createdAt",
      "updatedAt",
      "role");

  /*
   * Check sort request
   */
  private Pageable validateSorting(Pageable pageable) {

    for (Sort.Order order : pageable.getSort()) {
      if (!ALLOWED_SORT_FIELDS.contains(order.getProperty())) {
        throw new BadRequestInputException(
            "Invalid sort field: " + order.getProperty());
      }
    }

    return pageable;
  }

}
