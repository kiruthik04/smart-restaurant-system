package com.restaurant.backend.reservation.dto;

public class TableAvailabilityResponse {

    private int tableNumber;
    private int capacity;
    private boolean available;

    public TableAvailabilityResponse(
            int tableNumber,
            int capacity,
            boolean available) {
        this.tableNumber = tableNumber;
        this.capacity = capacity;
        this.available = available;
    }

    public int getTableNumber() {
        return tableNumber;
    }

    public int getCapacity() {
        return capacity;
    }

    public boolean isAvailable() {
        return available;
    }
}
