package com.restaurant.reservation_service.dto;

import java.time.LocalDate;
import java.time.LocalTime;

public class ReservationResponse {

    private Long id;
    private int tableNumber;
    private LocalDate reservationDate;
    private LocalTime startTime;
    private LocalTime endTime;
    private String status;

    public ReservationResponse(
            Long id,
            int tableNumber,
            LocalDate reservationDate,
            LocalTime startTime,
            LocalTime endTime,
            String status
    ) {
        this.id = id;
        this.tableNumber = tableNumber;
        this.reservationDate = reservationDate;
        this.startTime = startTime;
        this.endTime = endTime;
        this.status = status;
    }

    public Long getId() {
        return id;
    }

    public int getTableNumber() {
        return tableNumber;
    }

    public LocalDate getReservationDate() {
        return reservationDate;
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
}
