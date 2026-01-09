package com.restaurant.backend.order.controller;

import com.restaurant.backend.order.dto.BillResponse;
import com.restaurant.backend.order.service.BillService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/billing")
public class BillController {

    private final BillService billService;

    public BillController(BillService billService) {
        this.billService = billService;
    }

    @GetMapping("/{tableId}")
    public ResponseEntity<BillResponse> getBill(@PathVariable Long tableId) {
        return ResponseEntity.ok(billService.generateBill(tableId));
    }

    @GetMapping("/by-number/{tableNumber}")
    public ResponseEntity<?> getBillByNumber(@PathVariable Integer tableNumber) {
        try {
            return ResponseEntity.ok(billService.generateBillByTableNumber(tableNumber));
        } catch (Exception e) {
            e.printStackTrace(); // Log to server console
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }
}
