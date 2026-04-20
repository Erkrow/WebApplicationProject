package com.musicshop.backend.exception;

public class ProductNotFoundException extends NotFoundException {
    public ProductNotFoundException() {
        super("Product not found");
    }
}
