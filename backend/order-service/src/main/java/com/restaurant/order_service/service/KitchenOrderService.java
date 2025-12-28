package com.restaurant.order_service.service;

import com.restaurant.order_service.dto.KitchenOrderResponse;
import java.util.List;

public interface KitchenOrderService {
    List<KitchenOrderResponse> getKitchenQueue();
    void startOrder(Long orderId);
    void completeOrder(Long orderId);
}
