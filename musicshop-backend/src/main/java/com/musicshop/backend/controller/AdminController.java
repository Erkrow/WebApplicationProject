package com.musicshop.backend.controller;

import com.musicshop.backend.dto.QuoteDiscountRequest;
import com.musicshop.backend.model.Order;
import com.musicshop.backend.model.User;
import com.musicshop.backend.service.AdminService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole(\'ROLE_ADMIN\')")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/orders")
    public ResponseEntity<List<Order>> getAllOrders() {
        return ResponseEntity.ok(adminService.getAllOrders());
    }

    @PostMapping("/orders/discount")
    public ResponseEntity<Order> applyDiscount(@RequestBody QuoteDiscountRequest request) {
        return ResponseEntity.ok(adminService.applyDiscount(request));
    }

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(adminService.getAllUsers());
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        adminService.deleteUser(id);
        return ResponseEntity.ok().build();
    }
}
