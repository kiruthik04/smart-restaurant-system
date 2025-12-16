package com.restaurant.order_service.service;

import com.restaurant.order_service.dto.OrderRequest;
import com.restaurant.order_service.dto.OrderResponse;

import java.util.List;

public interface OrderService {

    OrderResponse placeOrder(OrderRequest request);

    List<OrderResponse> getAllOrders();

    OrderResponse getOrderById(Long id);
}
