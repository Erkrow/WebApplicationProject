package com.musicshop.backend.controller;

import com.musicshop.backend.model.Cart;
import com.musicshop.backend.model.User;
import com.musicshop.backend.service.CartService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
@PreAuthorize("isAuthenticated()")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @GetMapping
    public ResponseEntity<Cart> getOrCreateCart(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(cartService.getOrCreateCart(user.getId()));
    }

    @PostMapping("/add")
    public ResponseEntity<Cart> addProduct(@AuthenticationPrincipal User user, @RequestParam Long productId, @RequestParam Integer quantity) {
        return ResponseEntity.ok(cartService.addProduct(user.getId(), productId, quantity));
    }

    @DeleteMapping("/remove/{productId}")
    public ResponseEntity<Cart> removeProduct(@AuthenticationPrincipal User user, @PathVariable Long productId) {
        return ResponseEntity.ok(cartService.removeProduct(user.getId(), productId));
    }

    @DeleteMapping("/clear")
    public ResponseEntity<Void> clearCart(@AuthenticationPrincipal User user) {
        cartService.clearCart(user.getId());
        return ResponseEntity.ok().build();
    }
}
