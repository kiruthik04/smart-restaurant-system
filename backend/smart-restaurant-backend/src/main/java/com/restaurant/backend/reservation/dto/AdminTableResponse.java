package com.restaurant.backend.reservation.dto;

public class AdminTableResponse {

    private Long id;
    private int tableNumber;
    private int capacity;
    private boolean active;
    private String currentSessionId;
    private boolean enabled;
    private String tableCode;

    public AdminTableResponse(Long id, int tableNumber, int capacity, boolean active, String currentSessionId,
            boolean enabled, String tableCode) {
        this.id = id;
        this.tableNumber = tableNumber;
        this.capacity = capacity;
        this.active = active;
        this.currentSessionId = currentSessionId;
        this.enabled = enabled;
        this.tableCode = tableCode;
    }

    // Getters
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

    public String getCurrentSessionId() {
        return currentSessionId;
    }

    public boolean isEnabled() {
        return enabled;
    }

    public String getTableCode() {
        return tableCode;
    }
}
