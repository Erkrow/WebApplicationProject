package com.musicshop.backend.dto;

public record QuoteDiscountRequest(
    Long orderId,
    Integer discountPercent,
    String reason
) {}
