package com.restaurant.order_service.dto;

public class TableResponse {

    private Long id;
    private boolean active;

    public Long getId() {
        return id;
    }

    public boolean isActive() {
        return active;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setActive(boolean active) {
        this.active = active;
    }
}
