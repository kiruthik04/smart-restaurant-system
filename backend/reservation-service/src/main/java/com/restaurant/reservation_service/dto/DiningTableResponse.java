package com.restaurant.reservation_service.dto;

public class DiningTableResponse {

    private Long id;
    private int tableNumber;
    private int capacity;
    private boolean active;

    private String currentSessionId;

    public DiningTableResponse(Long id, int tableNumber, int capacity, boolean active, String currentSessionId) {
        this.id = id;
        this.tableNumber = tableNumber;
        this.capacity = capacity;
        this.active = active;
        this.currentSessionId = currentSessionId;
    }

    public Long getId() {
        return id;
    }

    public int getTableNumber() {
        return tableNumber;
    }

    public int getCapacity() {
        return capacity;
    }

    public boolean isActive() {
        return active;
    }

    public String getCurrentSessionId(){
        return currentSessionId;
    }
}
