package com.restaurant.reservation_service.controller;

import com.restaurant.reservation_service.dto.ClaimTableRequest;
import com.restaurant.reservation_service.dto.DiningTableRequest;
import com.restaurant.reservation_service.dto.DiningTableResponse;
import com.restaurant.reservation_service.exception.ResourceNotFoundException;
import com.restaurant.reservation_service.model.DiningTable;
import com.restaurant.reservation_service.repository.DiningTableRepository;
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

    @GetMapping("/by-number/{tableNumber}")
    public DiningTableResponse getByTableNumber(
            @PathVariable Integer tableNumber) {

        DiningTable table = service.getEntityByTableNumber(tableNumber);

        return new DiningTableResponse(
                table.getId(),
                table.getTableNumber(),
                table.getCapacity(),
                table.isActive(),
                table.getCurrentSessionId()
        );
    }
    @PutMapping("/claim")
    public void claimTable(@RequestBody ClaimTableRequest request) {
        service.claimTable(request.getTableId(), request.getOrderSessionId());
    }

    @PutMapping("/release/{tableId}")
    public void releaseTable(@PathVariable Long tableId) {
        service.releaseTable(tableId);
    }


}
