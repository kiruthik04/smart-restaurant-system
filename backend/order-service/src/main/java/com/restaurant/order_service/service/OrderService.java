package com.restaurant.order_service.service;

import com.restaurant.order_service.dto.OrderRequest;
import com.restaurant.order_service.dto.OrderResponse;

public interface OrderService {

    OrderResponse placeOrder(OrderRequest request);

    OrderResponse getOrderBySession(String sessionId);
}
