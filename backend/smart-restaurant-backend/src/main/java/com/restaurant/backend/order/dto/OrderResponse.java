package com.restaurant.backend.order.dto;

import java.util.List;

public class OrderResponse {
    private Long orderId;
    private double totalAmount;
    private String status;
    private List<OrderItemResponse> items;

    public Long getOrderId() {
        return orderId;
    }

    public double getTotalAmount() {
        return totalAmount;
    }

    public String getStatus() {
        return status;
    }

    public List<OrderItemResponse> getItems() {
        return items;
    }

    public void setOrderId(Long orderId) {
        this.orderId = orderId;
    }

    public void setTotalAmount(double totalAmount) {
        this.totalAmount = totalAmount;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public void setItems(List<OrderItemResponse> items) {
        this.items = items;
    }
}
