package com.musicshop.backend.controller;

import com.musicshop.backend.model.User;
import com.musicshop.backend.model.Wishlist;
import com.musicshop.backend.service.WishlistService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/wishlist")
@PreAuthorize("isAuthenticated()")
public class WishlistController {

    private final WishlistService wishlistService;

    public WishlistController(WishlistService wishlistService) {
        this.wishlistService = wishlistService;
    }

    @GetMapping
    public ResponseEntity<Wishlist> getOrCreate(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(wishlistService.getOrCreate(user.getId()));
    }

    @PostMapping("/add")
    public ResponseEntity<Wishlist> addProduct(@AuthenticationPrincipal User user, @RequestParam Long productId) {
        return ResponseEntity.ok(wishlistService.addProduct(user.getId(), productId));
    }

    @DeleteMapping("/remove/{productId}")
    public ResponseEntity<Wishlist> removeProduct(@AuthenticationPrincipal User user, @PathVariable Long productId) {
        return ResponseEntity.ok(wishlistService.removeProduct(user.getId(), productId));
    }
}
