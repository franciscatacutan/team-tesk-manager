package com.example.task_manager.config.security;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.password.PasswordEncoder;

class PasswordEncoderConfigTest {

  @Test
  void shouldEncodeNewPasswordsWithArgon2() {
    PasswordEncoder passwordEncoder = new PasswordEncoderConfig().passwordEncoder();

    String encoded = passwordEncoder.encode("Password123!");

    assertThat(encoded).startsWith("{argon2}");
    assertThat(passwordEncoder.matches("Password123!", encoded)).isTrue();
  }
}
