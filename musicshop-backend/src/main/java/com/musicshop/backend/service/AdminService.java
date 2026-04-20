package com.musicshop.backend.service;

import com.musicshop.backend.dto.QuoteDiscountRequest;
import com.musicshop.backend.exception.ResourceNotFoundException;
import com.musicshop.backend.model.Order;
import com.musicshop.backend.model.User;
import com.musicshop.backend.repository.OrderRepository;
import com.musicshop.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AdminService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;

    public AdminService(OrderRepository orderRepository, UserRepository userRepository) {
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    public Order applyDiscount(QuoteDiscountRequest request) {
        Order order = orderRepository.findById(request.orderId())
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
        order.setDiscountPercent(request.discountPercent());
        return orderRepository.save(order);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }
}
