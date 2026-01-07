package com.restaurant.reservation_service.service;

import com.restaurant.reservation_service.dto.EventResponseDto;
import com.restaurant.reservation_service.model.EventBooking;
import com.restaurant.reservation_service.repository.EventBookingRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AdminEventServiceImpl implements AdminEventService {

    private final EventBookingRepository eventBookingRepository;

    public AdminEventServiceImpl(EventBookingRepository eventBookingRepository) {
        this.eventBookingRepository = eventBookingRepository;
    }

    @Override
    public List<EventResponseDto> getAllEvents() {
        return eventBookingRepository.findAll()
                .stream()
                .map(EventResponseDto::fromEntity) // ✅ FIX HERE
                .toList();
    }
    @Override
    public void approveEvent(Long id) {
        EventBooking booking = eventBookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        booking.setStatus("APPROVED");
        eventBookingRepository.save(booking);
    }
    @Override
    public void cancelEvent(Long id) {
        EventBooking booking = eventBookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        booking.setStatus("CANCELLED");
        eventBookingRepository.save(booking);
    }
}
