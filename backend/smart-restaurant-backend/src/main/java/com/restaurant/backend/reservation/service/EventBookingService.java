package com.restaurant.backend.reservation.service;

import com.restaurant.backend.reservation.dto.EventBookingRequest;
import com.restaurant.backend.reservation.dto.EventBookingResponse;
import com.restaurant.backend.reservation.dto.HallAvailabilityResponse;

import java.util.List;

public interface EventBookingService {

    EventBookingResponse createEvent(EventBookingRequest request);

    void cancelEvent(Long eventId);

    List<HallAvailabilityResponse> getHallAvailability(
            String date,
            String startTime,
            String endTime,
            int guestCount);

}
