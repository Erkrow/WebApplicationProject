package com.musicshop.backend.dto;

public record JwtDTO(
    String token,
    String username,
    String role
) {}
