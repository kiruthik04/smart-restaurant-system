package com.restaurant.backend.order.controller;

import com.restaurant.backend.order.dto.OrderRequest;
import com.restaurant.backend.order.dto.OrderResponse;
import com.restaurant.backend.order.service.OrderService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    public ResponseEntity<OrderResponse> placeOrder(
            @RequestBody OrderRequest request) {

        return ResponseEntity.ok(orderService.placeOrder(request));
    }

    @GetMapping("/session/{sessionId}")
    public ResponseEntity<OrderResponse> getOrderBySession(@PathVariable String sessionId) {
        try {
            return ResponseEntity.ok(orderService.getOrderBySession(sessionId));
        } catch (com.restaurant.backend.order.exception.ResourceNotFoundException
                | com.restaurant.backend.reservation.exception.ResourceNotFoundException e) {
            // Return 204 No Content instead of 404 to avoid console errors
            return ResponseEntity.noContent().build();
        }
    }

    @GetMapping("/user/active/{userId}")
    public ResponseEntity<List<OrderResponse>> getActiveOrdersByUser(@PathVariable Long userId) {
        List<OrderResponse> orders = orderService.getActiveOrdersByUser(userId);
        if (orders.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(orders);
    }

    @PutMapping("/{orderId}/bill")
    public ResponseEntity<OrderResponse> generateBill(@PathVariable Long orderId) {
        return ResponseEntity.ok(orderService.generateBill(orderId));
    }
}
