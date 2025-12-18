package com.restaurant.reservation_service.controller;

import com.restaurant.reservation_service.dto.DiningTableRequest;
import com.restaurant.reservation_service.dto.DiningTableResponse;
import com.restaurant.reservation_service.service.DiningTableService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tables")
public class DiningTableController {

    private final DiningTableService service;

    public DiningTableController(DiningTableService service) {
        this.service = service;
    }

    @PostMapping
    public DiningTableResponse createTable(
            @Valid @RequestBody DiningTableRequest request) {
        return service.createTable(request);
    }

    @GetMapping
    public List<DiningTableResponse> getAllTables() {
        return service.getAllTables();
    }
}
