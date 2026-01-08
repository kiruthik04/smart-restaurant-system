package com.restaurant.backend.reservation.controller;

import com.restaurant.backend.reservation.dto.EventResponseDto;
import com.restaurant.backend.reservation.service.AdminEventService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/events")
@CrossOrigin(origins = "http://localhost:3000")
public class AdminEventController {

    private final AdminEventService adminEventService;

    public AdminEventController(AdminEventService adminEventService) {
        this.adminEventService = adminEventService;
    }

    // 🔹 GET ALL EVENT BOOKINGS (ADMIN)
    @GetMapping
    public List<EventResponseDto> getAllEvents() {
        return adminEventService.getAllEvents();
    }

    // 🔹 APPROVE EVENT
    @PutMapping("/{id}/approve")
    public void approveEvent(@PathVariable Long id) {
        adminEventService.approveEvent(id);
    }

    // 🔹 CANCEL EVENT
    @PutMapping("/{id}/cancel")
    public void cancelEvent(@PathVariable Long id) {
        adminEventService.cancelEvent(id);
    }
}
