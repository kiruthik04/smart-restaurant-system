package com.restaurant.reservation_service.service;

import com.restaurant.reservation_service.dto.EventResponseDto;
import com.restaurant.reservation_service.model.EventBooking;

import java.util.List;

public interface AdminEventService {

    List<EventResponseDto> getAllEvents();

    void approveEvent(Long id);

    void cancelEvent(Long id);
}
