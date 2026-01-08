package com.restaurant.backend.reservation.controller;

import com.restaurant.backend.reservation.dto.AdminTableResponse;
import com.restaurant.backend.reservation.dto.DiningTableRequest;
import com.restaurant.backend.reservation.dto.DiningTableResponse;
import com.restaurant.backend.reservation.service.DiningTableService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/tables")
public class AdminTableController {

    private final DiningTableService service;

    public AdminTableController(DiningTableService service) {
        this.service = service;
    }

    @GetMapping
    public List<AdminTableResponse> getAllTables() {
        return service.getAllTablesForAdmin();
    }

    @PostMapping
    public DiningTableResponse createTable(@Valid @RequestBody DiningTableRequest request) {
        return service.createTable(request);
    }

    @PutMapping("/{tableId}/release")
    public void forceReleaseTable(@PathVariable Long tableId) {
        service.forceReleaseTable(tableId);
    }

    @PutMapping("/{tableId}/disable")
    public void disableTable(@PathVariable Long tableId) {
        service.disableTable(tableId);
    }

    @PutMapping("/{tableId}/enable")
    public void enableTable(@PathVariable Long tableId) {
        service.enableTable(tableId);
    }
}
