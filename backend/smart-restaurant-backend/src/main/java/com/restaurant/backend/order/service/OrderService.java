package com.restaurant.backend.order.service;

import com.restaurant.backend.order.dto.OrderRequest;
import com.restaurant.backend.order.dto.OrderResponse;

public interface OrderService {

    OrderResponse placeOrder(OrderRequest request);

    OrderResponse getOrderBySession(String sessionId);

    OrderResponse getActiveOrderByUser(Long userId);
}
