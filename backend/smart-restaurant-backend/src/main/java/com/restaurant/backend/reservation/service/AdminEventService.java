package com.restaurant.backend.reservation.service;

import com.restaurant.backend.reservation.dto.EventResponseDto;

import java.util.List;

public interface AdminEventService {

    List<EventResponseDto> getAllEvents();

    void approveEvent(Long id);

    void cancelEvent(Long id);
}
