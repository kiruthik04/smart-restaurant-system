package com.restaurant.backend.order.dto;

public class KitchenOrderItemResponse {
    private String name;
    private int quantity;

    public KitchenOrderItemResponse(String name, int quantity) {
        this.name = name;
        this.quantity = quantity;
    }

    public String getName() {
        return name;
    }

    public int getQuantity() {
        return quantity;
    }
}
