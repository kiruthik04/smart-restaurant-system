package com.restaurant.backend.reservation.service;

import com.restaurant.backend.reservation.dto.HallAvailabilityResponse;
import com.restaurant.backend.reservation.repository.EventHallRepository;
import com.restaurant.backend.reservation.repository.EventBookingRepository;
import com.restaurant.backend.reservation.dto.EventBookingResponse;
import com.restaurant.backend.reservation.dto.EventBookingRequest;
import com.restaurant.backend.reservation.exception.InvalidReservationException;
import com.restaurant.backend.reservation.exception.TableAlreadyBookedException;
import com.restaurant.backend.reservation.exception.ResourceNotFoundException;
import com.restaurant.backend.reservation.model.EventBooking;
import com.restaurant.backend.reservation.model.EventHall;
import com.restaurant.backend.menu.service.MenuService;
import com.restaurant.backend.menu.dto.MenuItemResponse;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Service
public class EventBookingServiceImpl implements EventBookingService {

    private final EventHallRepository hallRepository;
    private final EventBookingRepository bookingRepository;
    private final MenuService menuService;

    public EventBookingServiceImpl(
            EventHallRepository hallRepository,
            EventBookingRepository bookingRepository,
            MenuService menuService) {
        this.hallRepository = hallRepository;
        this.bookingRepository = bookingRepository;
        this.menuService = menuService;
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
                        request.getEndTime())
                .isEmpty();

        if (conflict) {
            throw new TableAlreadyBookedException(
                    "Event already booked for the selected time slot");
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
                        .toList());

        EventBooking saved = bookingRepository.save(booking);

        return new EventBookingResponse(
                saved.getId(),
                "AUTO-ASSIGNED",
                saved.getEventDate(),
                saved.getStartTime(),
                saved.getEndTime(),
                saved.getStatus(),
                request.getMenuItemIds());
    }

    private void validateMenuItems(List<Long> menuItemIds) {

        for (Long menuItemId : menuItemIds) {

            try {
                // Direct interaction with MenuService
                MenuItemResponse response = menuService.getMenuItemById(menuItemId);

                if (!response.isAvailable()) {
                    throw new InvalidReservationException(
                            "Menu item not available: " + menuItemId);
                }

            } catch (com.restaurant.backend.menu.exception.ResourceNotFoundException ex) {
                throw new InvalidReservationException(
                        "Menu item not found: " + menuItemId);
            } catch (Exception ex) {
                // General catch for other issues
                throw new InvalidReservationException(
                        "Error while validating item: " + menuItemId + ". " + ex.getMessage());
            }
        }
    }

    @Override
    public List<HallAvailabilityResponse> getHallAvailability(
            String date,
            String startTime,
            String endTime,
            int guestCount) {

        LocalDate localDate = LocalDate.parse(date);
        LocalTime start = LocalTime.parse(startTime);
        LocalTime end = LocalTime.parse(endTime);

        List<EventHall> halls = hallRepository.findByCapacityGreaterThanEqualAndActiveTrue(
                guestCount);

        return halls.stream()
                .map(hall -> {
                    boolean hasConflict = !bookingRepository
                            .findOverlappingEvents(
                                    localDate,
                                    start,
                                    end)
                            .isEmpty();

                    return new HallAvailabilityResponse(
                            hall.getId(),
                            hall.getName(),
                            hall.getCapacity(),
                            !hasConflict);
                })
                .toList();
    }

    @Override
    public void cancelEvent(Long eventId) {

        EventBooking booking = bookingRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found"));

        booking.cancel();
        bookingRepository.save(booking);
    }
}
