package com.restaurant.reservation_service.controller;

import com.restaurant.reservation_service.dto.AdminTableResponse;
import com.restaurant.reservation_service.dto.DiningTableRequest;
import com.restaurant.reservation_service.dto.DiningTableResponse;
import com.restaurant.reservation_service.service.DiningTableService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/tables")
public class AdminTableController {

    private final DiningTableService service;

    public AdminTableController(DiningTableService service) {
        this.service = service;
    }
    @PostMapping
    public DiningTableResponse createTable(@RequestBody DiningTableRequest request) {
        return service.createTable(request);
    }

    // 🔹 View all tables
    @GetMapping
    public List<AdminTableResponse> getAllTables() {
        return service.getAllTablesForAdmin();
    }

    // 🔹 Force release table
    @PutMapping("/{tableId}/release")
    public void forceRelease(@PathVariable Long tableId) {
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
