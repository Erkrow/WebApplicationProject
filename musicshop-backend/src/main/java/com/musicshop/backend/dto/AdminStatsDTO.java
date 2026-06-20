package com.musicshop.backend.dto;

import java.math.BigDecimal;
import java.util.Map;

/**
 * DTO ze statystykami dla panelu administracyjnego.
 */
public class AdminStatsDTO {

    private long totalOrders;
    private long totalUsers;
    private long totalProducts;
    private BigDecimal totalRevenue;
    private Map<String, Long> ordersByStatus;       // PENDING -> 3, SHIPPED -> 7, ...
    private Map<String, Long> productsByCategory;   // elektryczne -> 5, akustyczne -> 3, ...
    private long lowStockProducts;                  // produkty z stockQuantity <= 3

    public AdminStatsDTO() {}

    public long getTotalOrders() { return totalOrders; }
    public void setTotalOrders(long totalOrders) { this.totalOrders = totalOrders; }

    public long getTotalUsers() { return totalUsers; }
    public void setTotalUsers(long totalUsers) { this.totalUsers = totalUsers; }

    public long getTotalProducts() { return totalProducts; }
    public void setTotalProducts(long totalProducts) { this.totalProducts = totalProducts; }

    public BigDecimal getTotalRevenue() { return totalRevenue; }
    public void setTotalRevenue(BigDecimal totalRevenue) { this.totalRevenue = totalRevenue; }

    public Map<String, Long> getOrdersByStatus() { return ordersByStatus; }
    public void setOrdersByStatus(Map<String, Long> ordersByStatus) { this.ordersByStatus = ordersByStatus; }

    public Map<String, Long> getProductsByCategory() { return productsByCategory; }
    public void setProductsByCategory(Map<String, Long> productsByCategory) { this.productsByCategory = productsByCategory; }

    public long getLowStockProducts() { return lowStockProducts; }
    public void setLowStockProducts(long lowStockProducts) { this.lowStockProducts = lowStockProducts; }
}
