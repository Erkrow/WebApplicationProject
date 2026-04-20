package com.musicshop.backend.dto;

public record RegisterRequest(
    String username,
    String email,
    String password,
    String firstName,
    String lastName
) {}
