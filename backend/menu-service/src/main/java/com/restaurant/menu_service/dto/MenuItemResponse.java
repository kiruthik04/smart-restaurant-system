package com.restaurant.menu_service.dto;

public class MenuItemResponse{
    private Long id;
    private String name;
    private String description;
    private double price;
    private boolean available;

    public MenuItemResponse(Long id, String name, String description, double price, boolean available) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.price = price;
        this.available = available;
    }
    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getDescription() {
        return description;
    }

    public double getPrice() {
        return price;
    }

    public boolean isAvailable() {
        return available;
    }
}