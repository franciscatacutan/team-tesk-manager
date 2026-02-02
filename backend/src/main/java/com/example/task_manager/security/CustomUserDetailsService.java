package com.example.task_manager.security;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.example.task_manager.user.UserEntity;
import com.example.task_manager.user.UserRepo;

import lombok.RequiredArgsConstructor;

/**
 * Custom UserDetailsService implementation for loading user details from the
 * database.
 */
@Service
@RequiredArgsConstructor
public class CustomUserDetailsService
                implements UserDetailsService {

        private final UserRepo userRepository;

        /**
         * Loads user details by email.
         */
        @Override
        public UserDetails loadUserByUsername(String email)
                        throws UsernameNotFoundException {

                // Load user from the database
                UserEntity user = userRepository.findByEmail(email)
                                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

                return org.springframework.security.core.userdetails.User
                                .withUsername(user.getEmail())
                                .password(user.getPassword())
                                .roles(user.getRole().name())
                                .build();
        }
}