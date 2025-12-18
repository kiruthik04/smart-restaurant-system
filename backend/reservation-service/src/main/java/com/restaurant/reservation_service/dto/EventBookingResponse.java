package com.restaurant.reservation_service.dto;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public class EventBookingResponse {

    private Long id;
    private String hallName;
    private LocalDate eventDate;
    private LocalTime startTime;
    private LocalTime endTime;
    private String status;
    private List<Long> menuItemIds;

    public EventBookingResponse(
            Long id,
            String hallName,
            LocalDate eventDate,
            LocalTime startTime,
            LocalTime endTime,
            String status,
            List<Long> menuItemIds
    ) {
        this.id = id;
        this.hallName = hallName;
        this.eventDate = eventDate;
        this.startTime = startTime;
        this.endTime = endTime;
        this.status = status;
        this.menuItemIds = menuItemIds;
    }

    public Long getId() {
        return id;
    }

    public String getHallName() {
        return hallName;
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

    public String getStatus() {
        return status;
    }

    public List<Long> getMenuItemIds() {
        return menuItemIds;
    }
}
