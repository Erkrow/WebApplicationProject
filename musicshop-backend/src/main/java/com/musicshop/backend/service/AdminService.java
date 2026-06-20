package com.musicshop.backend.service;

import com.musicshop.backend.dto.AdminStatsDTO;
import com.musicshop.backend.dto.QuoteDiscountRequest;
import com.musicshop.backend.dto.UserResponseDTO;
import com.musicshop.backend.exception.ResourceNotFoundException;
import com.musicshop.backend.model.Order;
import com.musicshop.backend.model.Product;
import com.musicshop.backend.repository.OrderRepository;
import com.musicshop.backend.repository.ProductRepository;
import com.musicshop.backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class AdminService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    public AdminService(OrderRepository orderRepository,
                        UserRepository userRepository,
                        ProductRepository productRepository) {
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
        this.productRepository = productRepository;
    }

    @Transactional(readOnly = true)
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    @Transactional
    public Order applyDiscount(QuoteDiscountRequest request) {
        Order order = orderRepository.findById(request.orderId())
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
        order.setDiscountPercent(request.discountPercent());
        return orderRepository.save(order);
    }

    // Zwraca UserResponseDTO — nie eksponuje hasla przez API
    @Transactional(readOnly = true)
    public List<UserResponseDTO> getAllUsers() {
        return userRepository.findAll().stream()
                .map(UserResponseDTO::from)
                .collect(Collectors.toList());
    }

    @Transactional
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    /**
     * Zwraca agregowane statystyki dla dashboardu administracyjnego.
     */
    @Transactional(readOnly = true)
    public AdminStatsDTO getStats() {
        AdminStatsDTO stats = new AdminStatsDTO();

        List<Order> orders = orderRepository.findAll();
        List<Product> products = productRepository.findAll();

        // Podstawowe liczniki
        stats.setTotalOrders(orders.size());
        stats.setTotalUsers(userRepository.count());
        stats.setTotalProducts(products.size());

        // Calkowity przychod — suma totalPrice zamowien o statusie != CANCELLED
        BigDecimal revenue = orders.stream()
                .filter(o -> o.getTotalPrice() != null
                        && !"CANCELLED".equalsIgnoreCase(o.getStatus()))
                .map(Order::getTotalPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        stats.setTotalRevenue(revenue);

        // Zamowienia pogrupowane po statusie
        Map<String, Long> byStatus = orders.stream()
                .collect(Collectors.groupingBy(
                        o -> o.getStatus() != null ? o.getStatus() : "UNKNOWN",
                        Collectors.counting()
                ));
        stats.setOrdersByStatus(byStatus);

        // Produkty pogrupowane po kategorii
        Map<String, Long> byCategory = products.stream()
                .collect(Collectors.groupingBy(
                        p -> p.getCategory() != null ? p.getCategory().getName() : "Bez kategorii",
                        Collectors.counting()
                ));
        stats.setProductsByCategory(byCategory);

        // Produkty z niskim stanem magazynowym (stockQuantity <= 3)
        long lowStock = products.stream()
                .filter(p -> p.getStockQuantity() != null && p.getStockQuantity() <= 3)
                .count();
        stats.setLowStockProducts(lowStock);

        return stats;
    }
}
