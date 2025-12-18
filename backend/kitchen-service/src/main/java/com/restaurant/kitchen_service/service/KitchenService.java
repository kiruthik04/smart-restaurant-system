package com.restaurant.kitchen_service.service;

import com.restaurant.kitchen_service.dto.KitchenOrderResponse;

public interface KitchenService {

    KitchenOrderResponse startCooking(Long orderId);

    KitchenOrderResponse markReady(Long orderId);
}
