package com.restaurant.backend.reservation.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public class EventBookingRequest {

    @NotBlank
    private String eventName;

    @NotNull
    private LocalDate eventDate;

    @NotNull
    private LocalTime startTime;

    @NotNull
    private LocalTime endTime;

    @Min(1)
    private int guestCount;

    private Long hallId;

    @NotNull
    private List<Long> menuItemIds;

    public String getEventName() {
        return eventName;
    }

    public LocalDate getEventDate() {
        return eventDate;
    }

    public LocalTime getStartTime() {
        return startTime;
    }

    public LocalTime getEndTime() {
        return endTime;
    }

    public int getGuestCount() {
        return guestCount;
    }

    public Long getHallId() {
        return hallId;
    }

    public List<Long> getMenuItemIds() {
        return menuItemIds;
    }

}
