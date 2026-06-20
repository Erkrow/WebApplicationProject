package com.musicshop.backend.controller;

import com.musicshop.backend.dto.OrderRequest;
import com.musicshop.backend.model.Order;
import com.musicshop.backend.model.User;
import com.musicshop.backend.service.OrderService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@PreAuthorize("isAuthenticated()")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    public ResponseEntity<Order> createFromCart(
            @AuthenticationPrincipal User user, @RequestBody OrderRequest request) {
        return ResponseEntity.ok(orderService.createFromCart(user.getId(), request));
    }

    @GetMapping
    public ResponseEntity<List<Order>> getByUser(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(orderService.getByUser(user.getId()));
    }

    // IDOR fix — sprawdzamy ze zamowienie nalezy do zalogowanego usera lub ze to admin
    @GetMapping("/{id}")
    public ResponseEntity<Order> getById(
            @PathVariable Long id, @AuthenticationPrincipal User user) {
        Order order = orderService.getById(id);

        boolean isOwner = order.getUser().getId().equals(user.getId());
        boolean isAdmin = user.getRole() != null && user.getRole().equals("ROLE_ADMIN");

        if (!isOwner && !isAdmin) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        return ResponseEntity.ok(order);
    }

    // Tylko ADMIN — zmiana statusu zamowienia
    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Order> updateStatus(
            @PathVariable Long id, @RequestBody String status) {
        return ResponseEntity.ok(orderService.updateStatus(id, status));
    }
}
