package com.restaurant.reservation_service.controller;

import com.restaurant.reservation_service.dto.ReservationRequest;
import com.restaurant.reservation_service.dto.ReservationResponse;
import com.restaurant.reservation_service.service.ReservationService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reservations")
public class ReservationController {

    private final ReservationService service;

    public ReservationController(ReservationService service) {
        this.service = service;
    }

    @PostMapping
    public ReservationResponse createReservation(
            @Valid @RequestBody ReservationRequest request) {
        return service.createReservation(request);
    }

    @GetMapping("/date/{date}")
    public List<ReservationResponse> getReservationsByDate(
            @PathVariable String date) {
        return service.getReservationsByDate(date);
    }

    @PutMapping("/{id}/cancel")
    public void cancelReservation(@PathVariable Long id) {
        service.cancelReservation(id);
    }

}
