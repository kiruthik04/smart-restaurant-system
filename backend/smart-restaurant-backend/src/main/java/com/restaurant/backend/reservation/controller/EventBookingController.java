package com.restaurant.backend.reservation.controller;

import com.restaurant.backend.reservation.dto.HallAvailabilityResponse;
import com.restaurant.backend.reservation.service.EventBookingService;
import com.restaurant.backend.reservation.dto.EventBookingResponse;
import com.restaurant.backend.reservation.dto.EventBookingRequest;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/events")
public class EventBookingController {

    private final EventBookingService service;

    public EventBookingController(EventBookingService service) {
        this.service = service;
    }

    @PostMapping
    public EventBookingResponse createEvent(
            @Valid @RequestBody EventBookingRequest request) {
        return service.createEvent(request);
    }

    @PutMapping("/{id}/cancel")
    public void cancelEvent(@PathVariable Long id) {
        service.cancelEvent(id);
    }

    @GetMapping("/availability/halls")
    public List<HallAvailabilityResponse> getHallAvailability(
            @RequestParam String date,
            @RequestParam String startTime,
            @RequestParam String endTime,
            @RequestParam int guests) {
        return service.getHallAvailability(date, startTime, endTime, guests);
    }

}
