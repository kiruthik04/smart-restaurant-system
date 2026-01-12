package com.restaurant.backend.reservation.service;

import com.restaurant.backend.reservation.dto.EventResponseDto;

import java.util.List;

public interface AdminEventService {

    List<EventResponseDto> getAllEvents();

    void approveEvent(Long id);

    void cancelEvent(Long id);

    // Hall Management
    com.restaurant.backend.reservation.model.EventHall createEventHall(
            com.restaurant.backend.reservation.model.EventHall hall);

    com.restaurant.backend.reservation.model.EventHall updateEventHall(Long id,
            com.restaurant.backend.reservation.model.EventHall hall);

    void deleteEventHall(Long id);

    List<com.restaurant.backend.reservation.model.EventHall> getAllHalls();
}
