package com.example.task_manager.user.dto;

import java.util.Set;

import com.example.task_manager.user.entity.UserRole;

/*
* DTO for fetching teams with search, filtering and sort
*/
public record UserSearchRequest(
    String search,
    Set<UserRole> roles) {

}