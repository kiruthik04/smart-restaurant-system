package com.restaurant.backend.reservation.dto;

public class AdminTableResponse {

    private Long id;
    private int tableNumber;
    private int capacity;
    private boolean inUse;
    private String currentSessionId;
    private boolean enabled;

    public AdminTableResponse(
            Long id,
            int tableNumber,
            int capacity,
            boolean inUse,
            String currentSessionId,
            boolean enabled) {
        this.id = id;
        this.tableNumber = tableNumber;
        this.capacity = capacity;
        this.inUse = inUse;
        this.currentSessionId = currentSessionId;
        this.enabled = enabled;
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

    public boolean isInUse() {
        return inUse;
    }

    public String getCurrentSessionId() {
        return currentSessionId;
    }

    public boolean isEnabled() {
        return enabled;
    }
}
