package com.restaurant.order_service.dto;

public class KitchenOrderRequest {

    private Long orderId;

    public KitchenOrderRequest() {
    }

    public KitchenOrderRequest(Long orderId) {
        this.orderId = orderId;
    }

    public Long getOrderId() {
        return orderId;
    }
}
