package com.restaurant.backend.order.service;

import com.restaurant.backend.order.dto.KitchenOrderResponse;

import java.util.List;

public interface KitchenOrderService {

    List<KitchenOrderResponse> getKitchenQueue();

    void startOrder(Long orderId);

    void completeOrder(Long orderId);
}
