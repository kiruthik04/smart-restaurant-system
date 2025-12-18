package com.restaurant.kitchen_service.controller;

import com.restaurant.kitchen_service.dto.KitchenOrderRequest;
import com.restaurant.kitchen_service.dto.KitchenOrderResponse;
import com.restaurant.kitchen_service.service.KitchenService;
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
