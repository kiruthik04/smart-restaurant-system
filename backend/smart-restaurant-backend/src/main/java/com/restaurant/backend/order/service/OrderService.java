package com.restaurant.backend.order.service;

import com.restaurant.backend.order.dto.OrderRequest;
import com.restaurant.backend.order.dto.OrderResponse;

import java.util.List;

public interface OrderService {

    OrderResponse placeOrder(OrderRequest request);

    OrderResponse getOrderBySession(String sessionId);

    List<OrderResponse> getActiveOrdersByUser(Long userId);
}
