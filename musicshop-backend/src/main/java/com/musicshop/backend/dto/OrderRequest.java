package com.musicshop.backend.dto;

public record OrderRequest(
    String shippingAddress,
    String billingAddress,
    String couponCode
) {}
