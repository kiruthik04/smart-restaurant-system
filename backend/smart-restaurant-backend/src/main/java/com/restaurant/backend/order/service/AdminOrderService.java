package com.restaurant.backend.order.service;

import com.restaurant.backend.order.dto.AdminOrderResponse;

import java.util.List;

public interface AdminOrderService {

    List<AdminOrderResponse> getAllOrders();

    AdminOrderResponse getOrderById(Long orderId);

    void markOrderCompleted(Long orderId);
}
