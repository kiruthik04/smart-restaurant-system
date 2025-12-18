package com.restaurant.reservation_service.dto;

public class HallAvailabilityResponse {

    private String hallName;
    private int capacity;
    private boolean available;

    public HallAvailabilityResponse(
            String hallName,
            int capacity,
            boolean available
    ) {
        this.hallName = hallName;
        this.capacity = capacity;
        this.available = available;
    }

    public String getHallName() {
        return hallName;
    }

    public int getCapacity() {
        return capacity;
    }

    public boolean isAvailable() {
        return available;
    }
}
