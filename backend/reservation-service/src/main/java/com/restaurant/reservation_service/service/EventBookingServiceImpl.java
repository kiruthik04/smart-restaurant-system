package com.restaurant.reservation_service.service;

import com.restaurant.reservation_service.dto.HallAvailabilityResponse;
import com.restaurant.reservation_service.dto.MenuItemResponse;
import com.restaurant.reservation_service.repository.EventHallRepository;
import com.restaurant.reservation_service.repository.EventBookingRepository;
import com.restaurant.reservation_service.dto.EventBookingResponse;
import com.restaurant.reservation_service.dto.EventBookingRequest;
import com.restaurant.reservation_service.exception.InvalidReservationException;
import com.restaurant.reservation_service.exception.TableAlreadyBookedException;
import com.restaurant.reservation_service.exception.ResourceNotFoundException;
import com.restaurant.reservation_service.model.EventBooking;
import com.restaurant.reservation_service.model.EventHall;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.client.HttpClientErrorException;

import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Service
public class EventBookingServiceImpl implements EventBookingService {

    private final EventHallRepository hallRepository;
    private final EventBookingRepository bookingRepository;
    private final RestTemplate restTemplate;

    public EventBookingServiceImpl(
            EventHallRepository hallRepository,
            EventBookingRepository bookingRepository,
            RestTemplate restTemplate
    ) {
        this.hallRepository = hallRepository;
        this.bookingRepository = bookingRepository;
        this.restTemplate = restTemplate;
    }

    @Override
    public EventBookingResponse createEvent(EventBookingRequest request) {

        validateMenuItems(request.getMenuItemIds());

        if (!request.getStartTime().isBefore(request.getEndTime())) {
            throw new InvalidReservationException("Invalid time range");
        }

        EventHall hall = hallRepository.findById(request.getHallId())
                .orElseThrow(() -> new ResourceNotFoundException("Hall not found"));

        // 🔹 Overlap check (global for now)
        boolean conflict = !bookingRepository
                .findOverlappingEvents(
                        request.getEventDate(),
                        request.getStartTime(),
                        request.getEndTime()
                ).isEmpty();

        if (conflict) {
            throw new TableAlreadyBookedException(
                    "Event already booked for the selected time slot"
            );
        }

        // 🔹 Create booking (NO constructor, setters only)
        EventBooking booking = new EventBooking();
        booking.setEventName(request.getEventName());
        booking.setEventDate(request.getEventDate());
        booking.setStartTime(request.getStartTime());
        booking.setEndTime(request.getEndTime());
        booking.setGuestCount(request.getGuestCount());
        booking.setStatus("BOOKED");

        // store menu item names/ids as strings
        booking.setMenuItems(
                request.getMenuItemIds()
                        .stream()
                        .map(String::valueOf)
                        .toList()
        );

        EventBooking saved = bookingRepository.save(booking);

        return new EventBookingResponse(
                saved.getId(),
                "AUTO-ASSIGNED",
                saved.getEventDate(),
                saved.getStartTime(),
                saved.getEndTime(),
                saved.getStatus(),
                request.getMenuItemIds()
        );
    }


    private void validateMenuItems(List<Long> menuItemIds) {

        for (Long menuItemId : menuItemIds) {

            try {
                var responseEntity =
                        restTemplate.getForEntity(
                                "http://localhost:8081/api/menu/" + menuItemId,
                                MenuItemResponse.class
                        );

                // 🔴 1. HTTP STATUS CHECK
                if (!responseEntity.getStatusCode().is2xxSuccessful()) {
                    throw new InvalidReservationException(
                            "Menu item validation failed: " + menuItemId
                    );
                }

                MenuItemResponse response = responseEntity.getBody();

                // 🔴 2. BODY NULL CHECK
                if (response == null) {
                    throw new InvalidReservationException(
                            "Menu item not found: " + menuItemId
                    );
                }

                // 🔴 3. BUSINESS RULE CHECK
                if (!response.isAvailable()) {
                    throw new InvalidReservationException(
                            "Menu item not available: " + menuItemId
                    );
                }

            } catch (HttpClientErrorException.NotFound ex) {
                throw new InvalidReservationException(
                        "Menu item not found: " + menuItemId
                );
            } catch (HttpClientErrorException ex) {
                throw new InvalidReservationException(
                        "Menu service error while validating item: " + menuItemId
                );
            }
        }
    }

    @Override
    public List<HallAvailabilityResponse> getHallAvailability(
            String date,
            String startTime,
            String endTime,
            int guestCount
    ) {

        LocalDate localDate = LocalDate.parse(date);
        LocalTime start = LocalTime.parse(startTime);
        LocalTime end = LocalTime.parse(endTime);

        List<EventHall> halls =
                hallRepository.findByCapacityGreaterThanEqualAndActiveTrue(
                        guestCount
                );

        return halls.stream()
                .map(hall -> {
                    boolean hasConflict = !bookingRepository
                            .findOverlappingEvents(
                                    localDate,
                                    start,
                                    end
                            ).isEmpty();

                    return new HallAvailabilityResponse(
                            hall.getId(),
                            hall.getName(),
                            hall.getCapacity(),
                            !hasConflict
                    );
                })
                .toList();
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
