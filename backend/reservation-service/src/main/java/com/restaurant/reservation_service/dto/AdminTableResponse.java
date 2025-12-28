package com.restaurant.reservation_service.dto;

public class AdminTableResponse {

    private Long id;
    private int tableNumber;
    private int capacity;
    private boolean inUse;
    private String currentSessionId;

    public AdminTableResponse(
            Long id,
            int tableNumber,
            int capacity,
            boolean inUse,
            String currentSessionId
    ) {
        this.id = id;
        this.tableNumber = tableNumber;
        this.capacity = capacity;
        this.inUse = inUse;
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

    public boolean isInUse() {
        return inUse;
    }

    public String getCurrentSessionId() {
        return currentSessionId;
    }
}
