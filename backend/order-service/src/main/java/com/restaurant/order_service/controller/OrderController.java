package com.restaurant.order_service.controller;

import com.restaurant.order_service.dto.OrderRequest;
import com.restaurant.order_service.dto.OrderResponse;
import com.restaurant.order_service.service.OrderService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
}
