package com.restaurant.order_service.controller;

import com.restaurant.order_service.dto.KitchenOrderResponse;
import com.restaurant.order_service.service.KitchenOrderService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/kitchen/orders")
public class KitchenOrderController {

    private final KitchenOrderService service;

    public KitchenOrderController(KitchenOrderService service) {
        this.service = service;
    }

    // 🔹 Queue: CREATED + IN_PROGRESS
    @GetMapping
    public List<KitchenOrderResponse> getQueue() {
        return service.getKitchenQueue();
    }

    // 🔹 Start cooking
    @PutMapping("/{orderId}/start")
    public void start(@PathVariable Long orderId) {
        service.startOrder(orderId);
    }

    // 🔹 Mark ready
    @PutMapping("/{orderId}/complete")
    public void complete(@PathVariable Long orderId) {
        service.completeOrder(orderId);
    }
}
