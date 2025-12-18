package com.restaurant.kitchen_service.dto;

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
