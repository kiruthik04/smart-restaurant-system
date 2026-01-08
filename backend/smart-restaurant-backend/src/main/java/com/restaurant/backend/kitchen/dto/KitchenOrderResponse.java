package com.restaurant.backend.kitchen.dto;

public class KitchenOrderResponse {

    private Long orderId;
    private String status;

    public KitchenOrderResponse(Long orderId, String status) {
        this.orderId = orderId;
        this.status = status;
    }

    public Long getOrderId() {
        return orderId;
    }

    public String getStatus() {
        return status;
    }
}
