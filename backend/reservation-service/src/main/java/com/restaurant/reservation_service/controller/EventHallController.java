package com.restaurant.reservation_service.controller;

import com.restaurant.reservation_service.model.EventHall;
import com.restaurant.reservation_service.repository.EventHallRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/event-halls")
public class EventHallController {

    private final EventHallRepository repository;

    public EventHallController(EventHallRepository repository) {
        this.repository = repository;
    }

    @PostMapping
    public EventHall createHall(@RequestBody EventHall hall) {
        return repository.save(hall);
    }

    @GetMapping
    public List<EventHall> getAllHalls() {
        return repository.findAll();
    }
}
