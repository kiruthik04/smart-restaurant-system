package com.restaurant.backend.kitchen.service;

import com.restaurant.backend.kitchen.dto.KitchenOrderResponse;

public interface KitchenService {

    KitchenOrderResponse startCooking(Long orderId);

    KitchenOrderResponse markReady(Long orderId);
}
