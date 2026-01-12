package com.restaurant.backend.reservation.service;

import com.restaurant.backend.reservation.dto.EventResponseDto;
import com.restaurant.backend.reservation.model.EventBooking;
import com.restaurant.backend.reservation.repository.EventBookingRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AdminEventServiceImpl implements AdminEventService {

    private final EventBookingRepository eventBookingRepository;
    private final com.restaurant.backend.reservation.repository.EventHallRepository eventHallRepository;

    public AdminEventServiceImpl(EventBookingRepository eventBookingRepository,
            com.restaurant.backend.reservation.repository.EventHallRepository eventHallRepository) {
        this.eventBookingRepository = eventBookingRepository;
        this.eventHallRepository = eventHallRepository;
    }

    @Override
    public List<EventResponseDto> getAllEvents() {
        return eventBookingRepository.findAll()
                .stream()
                .map(EventResponseDto::fromEntity)
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

    @Override
    public com.restaurant.backend.reservation.model.EventHall createEventHall(
            com.restaurant.backend.reservation.model.EventHall hall) {
        return eventHallRepository.save(hall);
    }

    @Override
    public com.restaurant.backend.reservation.model.EventHall updateEventHall(Long id,
            com.restaurant.backend.reservation.model.EventHall hallDetails) {
        com.restaurant.backend.reservation.model.EventHall hall = eventHallRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Hall not found"));

        hall.setName(hallDetails.getName());
        hall.setCapacity(hallDetails.getCapacity());
        hall.setActive(hallDetails.isActive());

        return eventHallRepository.save(hall);
    }

    @Override
    public void deleteEventHall(Long id) {
        if (!eventHallRepository.existsById(id)) {
            throw new RuntimeException("Hall not found");
        }
        eventHallRepository.deleteById(id);
    }

    @Override
    public List<com.restaurant.backend.reservation.model.EventHall> getAllHalls() {
        return eventHallRepository.findAll();
    }
}
