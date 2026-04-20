package com.musicshop.backend.dto;

public record CustomOrderRequest(
    String description,
    String customerNote
) {}
