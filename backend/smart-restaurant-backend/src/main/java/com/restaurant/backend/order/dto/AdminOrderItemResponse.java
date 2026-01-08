package com.restaurant.backend.order.dto;

public class AdminOrderItemResponse {

    private String name;
    private int quantity;
    private double price;
    private double subtotal;

    public AdminOrderItemResponse(String name, int quantity, double price, double subtotal) {
        this.name = name;
        this.quantity = quantity;
        this.price = price;
        this.subtotal = subtotal;
    }

    public String getName() {
        return name;
    }

    public int getQuantity() {
        return quantity;
    }

    public double getPrice() {
        return price;
    }

    public double getSubtotal() {
        return subtotal;
    }
}
