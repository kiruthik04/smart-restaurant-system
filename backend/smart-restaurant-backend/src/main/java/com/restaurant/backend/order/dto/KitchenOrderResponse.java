package com.restaurant.backend.order.dto;

import java.time.LocalDateTime;
import java.util.List;

public class KitchenOrderResponse {

    private Long orderId;
    private int tableNumber;
    private String status;
    private LocalDateTime createdAt;
    private List<KitchenOrderItemResponse> items;

    public KitchenOrderResponse(
            Long orderId,
            int tableNumber,
            String status,
            LocalDateTime createdAt,
            List<KitchenOrderItemResponse> items) {
        this.orderId = orderId;
        this.tableNumber = tableNumber;
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

    public String getStatus() {
        return status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public List<KitchenOrderItemResponse> getItems() {
        return items;
    }
}
