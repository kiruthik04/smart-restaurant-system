package com.restaurant.backend.reservation.controller;

import com.restaurant.backend.reservation.dto.ReservationRequest;
import com.restaurant.backend.reservation.dto.ReservationResponse;
import com.restaurant.backend.reservation.dto.SmartReservationRequest;
import com.restaurant.backend.reservation.dto.TableAvailabilityResponse;
import com.restaurant.backend.reservation.service.ReservationService;
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

    @PostMapping("/smart")
    public ReservationResponse createSmartReservation(
            @RequestBody @Valid SmartReservationRequest request) {
        return service.createSmartReservation(request);
    }

    @PutMapping("/{id}/cancel")
    public void cancelReservation(@PathVariable Long id) {
        service.cancelReservation(id);
    }

    @GetMapping("/availability/tables")
    public List<TableAvailabilityResponse> getTableAvailability(
            @RequestParam String date,
            @RequestParam String startTime,
            @RequestParam String endTime,
            @RequestParam int people) {
        return service.getTableAvailability(date, startTime, endTime, people);
    }

}
