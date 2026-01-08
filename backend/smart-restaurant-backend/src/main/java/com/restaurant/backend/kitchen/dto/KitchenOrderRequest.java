package com.restaurant.backend.kitchen.dto;

public class KitchenOrderRequest {

    private Long orderId;

    public KitchenOrderRequest() {
    }

    public Long getOrderId() {
        return orderId;
    }

    public void setOrderId(Long orderId) {
        this.orderId = orderId;
    }
}
