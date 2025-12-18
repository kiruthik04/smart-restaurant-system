package com.restaurant.reservation_service.controller;

import com.restaurant.reservation_service.service.EventBookingService;
import com.restaurant.reservation_service.dto.EventBookingResponse;
import com.restaurant.reservation_service.dto.EventBookingRequest;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

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
}
