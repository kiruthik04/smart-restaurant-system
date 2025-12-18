package com.restaurant.reservation_service.dto;

public class MenuItemResponse {

    private Long id;
    private boolean available;

    public Long getId() {
        return id;
    }

    public boolean isAvailable() {
        return available;
    }
}
