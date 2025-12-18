package com.restaurant.reservation_service.service;

import com.restaurant.reservation_service.repository.EventHallRepository;
import com.restaurant.reservation_service.repository.EventBookingRepository;
import com.restaurant.reservation_service.dto.EventBookingResponse;
import com.restaurant.reservation_service.dto.EventBookingRequest;
import com.restaurant.reservation_service.exception.InvalidReservationException;
import com.restaurant.reservation_service.exception.TableAlreadyBookedException;
import com.restaurant.reservation_service.exception.ResourceNotFoundException;
import com.restaurant.reservation_service.model.EventBooking;
import com.restaurant.reservation_service.model.EventHall;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EventBookingServiceImpl implements EventBookingService {

    private final EventHallRepository hallRepository;
    private final EventBookingRepository bookingRepository;

    public EventBookingServiceImpl(
            EventHallRepository hallRepository,
            EventBookingRepository bookingRepository
    ) {
        this.hallRepository = hallRepository;
        this.bookingRepository = bookingRepository;
    }

    @Override
    public EventBookingResponse createEvent(EventBookingRequest request) {

        if (!request.getStartTime().isBefore(request.getEndTime())) {
            throw new InvalidReservationException("Invalid time range");
        }

        List<EventHall> halls =
                hallRepository.findByCapacityGreaterThanEqualAndActiveTrue(
                        request.getGuestCount()
                );

        for (EventHall hall : halls) {

            boolean conflict = !bookingRepository
                    .findOverlappingEvents(
                            hall.getId(),
                            request.getEventDate(),
                            request.getStartTime(),
                            request.getEndTime()
                    ).isEmpty();

            if (!conflict) {
                EventBooking booking = new EventBooking(
                        request.getEventName(),
                        hall,
                        request.getEventDate(),
                        request.getStartTime(),
                        request.getEndTime(),
                        request.getGuestCount(),
                        request.getMenuItemIds()
                );

                EventBooking saved = bookingRepository.save(booking);

                return new EventBookingResponse(
                        saved.getId(),
                        hall.getName(),
                        saved.getEventDate(),
                        saved.getStartTime(),
                        saved.getEndTime(),
                        saved.getStatus(),
                        request.getMenuItemIds()
                );
            }
        }

        throw new TableAlreadyBookedException(
                "No halls available for the selected time slot"
        );
    }

    @Override
    public void cancelEvent(Long eventId) {

        EventBooking booking = bookingRepository.findById(eventId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Event not found")
                );

        booking.cancel();
        bookingRepository.save(booking);
    }
}
