package com.restaurant.backend.order.dto;

import java.time.LocalDateTime;
import java.util.List;

public class AdminOrderResponse {

    private Long orderId;
    private int tableNumber;
    private double totalAmount;
    private String status;
    private LocalDateTime createdAt;
    private List<AdminOrderItemResponse> items;

    public AdminOrderResponse(
            Long orderId,
            int tableNumber,
            double totalAmount,
            String status,
            LocalDateTime createdAt,
            List<AdminOrderItemResponse> items) {
        this.orderId = orderId;
        this.tableNumber = tableNumber;
        this.totalAmount = totalAmount;
        this.status = status;
        this.createdAt = createdAt;
        this.items = items;
    }

    public Long getOrderId() {
        return orderId;
    }

    public int getTableNumber() {
        return tableNumber;
    }

    public double getTotalAmount() {
        return totalAmount;
    }

    public String getStatus() {
        return status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public List<AdminOrderItemResponse> getItems() {
        return items;
    }
}
