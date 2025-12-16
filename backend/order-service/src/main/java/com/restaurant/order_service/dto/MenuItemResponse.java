package com.restaurant.order_service.dto;

public class MenuItemResponse {

    private Long id;
    private double price;
    private boolean available;

    public MenuItemResponse() {
    }

    public Long getId() {
        return id;
    }

    public double getPrice() {
        return price;
    }

    public boolean isAvailable() {
        return available;
    }
}
