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

    // 🔹 CREATE HALL
    @PostMapping("/halls")
    public com.restaurant.backend.reservation.model.EventHall createHall(
            @RequestBody com.restaurant.backend.reservation.model.EventHall hall) {
        return adminEventService.createEventHall(hall);
    }

    // 🔹 UPDATE HALL
    @PutMapping("/halls/{id}")
    public com.restaurant.backend.reservation.model.EventHall updateHall(@PathVariable Long id,
            @RequestBody com.restaurant.backend.reservation.model.EventHall hall) {
        return adminEventService.updateEventHall(id, hall);
    }

    // 🔹 DELETE HALL
    @DeleteMapping("/halls/{id}")
    public void deleteHall(@PathVariable Long id) {
        adminEventService.deleteEventHall(id);
    }

    // 🔹 GET ALL HALLS
    @GetMapping("/halls")
    public List<com.restaurant.backend.reservation.model.EventHall> getAllHalls() {
        return adminEventService.getAllHalls();
    }
}
