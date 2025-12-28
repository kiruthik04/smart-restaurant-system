package com.restaurant.order_service.service;

import com.restaurant.order_service.dto.AdminOrderResponse;

import java.util.List;

public interface AdminOrderService {

    List<AdminOrderResponse> getAllOrders();
    AdminOrderResponse getOrderById(Long orderId);
    void markOrderCompleted(Long orderId);
}
