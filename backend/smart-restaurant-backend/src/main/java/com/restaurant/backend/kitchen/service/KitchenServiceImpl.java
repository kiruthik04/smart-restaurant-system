package com.restaurant.backend.kitchen.service;

import com.restaurant.backend.kitchen.dto.KitchenOrderResponse;
import com.restaurant.backend.kitchen.model.KitchenOrder;
import com.restaurant.backend.kitchen.repository.KitchenOrderRepository;
import org.springframework.stereotype.Service;

@Service
public class KitchenServiceImpl implements KitchenService {

    private final KitchenOrderRepository repository;

    public KitchenServiceImpl(KitchenOrderRepository repository) {
        this.repository = repository;
    }

    @Override
    public KitchenOrderResponse startCooking(Long orderId) {

        KitchenOrder order = repository.findByOrderId(orderId)
                .orElse(new KitchenOrder(orderId, "COOKING"));

        repository.save(order);

        return new KitchenOrderResponse(orderId, "COOKING");
    }

    @Override
    public KitchenOrderResponse markReady(Long orderId) {

        KitchenOrder order = repository.findByOrderId(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        order.setStatus("READY");
        repository.save(order);

        return new KitchenOrderResponse(orderId, "READY");
    }
}
