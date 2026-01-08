package com.restaurant.backend.reservation.dto;

public class HallAvailabilityResponse {
    private Long id;
    private String hallName;
    private int capacity;
    private boolean available;

    public HallAvailabilityResponse(
            Long id,
            String hallName,
            int capacity,
            boolean available) {
        this.id = id;
        this.hallName = hallName;
        this.capacity = capacity;
        this.available = available;
    }

    public Long getId() {
        return id;
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
