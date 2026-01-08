package com.restaurant.backend.reservation.dto;

import jakarta.validation.constraints.Min;

public class DiningTableRequest {

    @Min(value = 1, message = "Table number must be positive")
    private int tableNumber;

    @Min(value = 1, message = "Capacity must be at least 1")
    private int capacity;

    public int getTableNumber() {
        return tableNumber;
    }

    public void setTableNumber(int tableNumber) {
        this.tableNumber = tableNumber;
    }

    public int getCapacity() {
        return capacity;
    }

    public void setCapacity(int capacity) {
        this.capacity = capacity;
    }
}
