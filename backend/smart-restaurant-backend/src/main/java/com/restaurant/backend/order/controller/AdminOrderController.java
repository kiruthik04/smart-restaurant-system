package com.restaurant.backend.order.controller;

import com.restaurant.backend.order.dto.AdminOrderResponse;
import com.restaurant.backend.order.service.AdminOrderService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/orders")
public class AdminOrderController {

    private final AdminOrderService service;

    public AdminOrderController(AdminOrderService service) {
        this.service = service;
    }

    // 1️⃣ List all orders
    @GetMapping
    public List<AdminOrderResponse> getAllOrders() {
        return service.getAllOrders();
    }

    // 2️⃣ View order details
    @GetMapping("/{orderId}")
    public AdminOrderResponse getOrder(@PathVariable Long orderId) {
        return service.getOrderById(orderId);
    }

    // 3️⃣ Mark order completed
    @PutMapping("/{orderId}/complete")
    public void completeOrder(@PathVariable Long orderId) {
        service.markOrderCompleted(orderId);
    }
}
