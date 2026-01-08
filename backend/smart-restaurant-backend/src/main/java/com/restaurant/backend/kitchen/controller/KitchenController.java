package com.restaurant.backend.kitchen.controller;

import com.restaurant.backend.kitchen.dto.KitchenOrderRequest;
import com.restaurant.backend.kitchen.dto.KitchenOrderResponse;
import com.restaurant.backend.kitchen.service.KitchenService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/kitchen")
public class KitchenController {

    private final KitchenService kitchenService;

    public KitchenController(KitchenService kitchenService) {
        this.kitchenService = kitchenService;
    }

    @PostMapping("/start")
    public KitchenOrderResponse startCooking(
            @RequestBody KitchenOrderRequest request) {
        return kitchenService.startCooking(request.getOrderId());
    }

    @PostMapping("/ready")
    public KitchenOrderResponse markReady(
            @RequestBody KitchenOrderRequest request) {
        return kitchenService.markReady(request.getOrderId());
    }
}
