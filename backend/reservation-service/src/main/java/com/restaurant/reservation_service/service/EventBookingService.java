package com.restaurant.reservation_service.service;

import com.restaurant.reservation_service.dto.EventBookingRequest;
import com.restaurant.reservation_service.dto.EventBookingResponse;
import com.restaurant.reservation_service.dto.HallAvailabilityResponse;

import java.util.List;

public interface EventBookingService {

    EventBookingResponse createEvent(EventBookingRequest request);

    void cancelEvent(Long eventId);

    List<HallAvailabilityResponse> getHallAvailability(
            String date,
            String startTime,
            String endTime,
            int guestCount
    );

}
