package com.example.task_manager.auth;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.example.task_manager.auth.dto.AuthResponse;
import com.example.task_manager.auth.dto.RegisterRequest;
import com.example.task_manager.exception.api.EmailAlreadyInUseException;
import com.example.task_manager.security.JwtService;
import com.example.task_manager.user.UserEntity;
import com.example.task_manager.user.UserRepo;

/**
 * Unit tests for AuthService.
 */
@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    // Mocked dependencies
    @Mock
    private UserRepo userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtService jwtService;

    @InjectMocks
    private AuthService authService;

    /**
     * Tests successful user registration.
     */
    @Test
    void shouldRegisterUserSuccessfully() {

        // Data for registration
        String email = "test@test.com";
        String password = "password123";

        RegisterRequest request = new RegisterRequest(
                email,
                "Test",
                "Name",
                password);

        when(userRepository.existsByEmail(email))
                .thenReturn(false);

        when(passwordEncoder.encode(password))
                .thenReturn("hashed-pass");

        when(userRepository.save(any(UserEntity.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        when(jwtService.generateToken(any(UserEntity.class)))
                .thenReturn("fake-jwt-token");

        AuthResponse response = authService.register(request);

        // Verify interactions and response
        verify(passwordEncoder).encode("password123");
        verify(userRepository).save(any(UserEntity.class));
        // Verify that the token was generated
        assertThat(response.token()).isEqualTo("fake-jwt-token");

    }

    /**
     * Tests registration failure when email is already in use.
     */
    @Test
    void shouldThrowExceptionWhenEmailAlreadyExists() {

        // Existing email
        String email = "john@test.com";

        RegisterRequest request = new RegisterRequest(
                email,
                "John",
                "Doe",
                "password123");

        when(userRepository.existsByEmail(email))
                .thenReturn(true);

        // Assert that EmailAlreadyInUseException is thrown
        assertThrows(EmailAlreadyInUseException.class,
                () -> authService.register(request));
    }
}
