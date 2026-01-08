package com.restaurant.backend.reservation.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.time.LocalTime;

public class SmartReservationRequest {

    @NotBlank
    private String customerName;

    @NotBlank
    private String customerPhone;

    @NotNull
    private LocalDate reservationDate;

    @NotNull
    private LocalTime startTime;

    @NotNull
    private LocalTime endTime;

    @Min(1)
    private int numberOfPeople;

    public String getCustomerName() {
        return customerName;
    }

    public String getCustomerPhone() {
        return customerPhone;
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

    public int getNumberOfPeople() {
        return numberOfPeople;
    }
}
