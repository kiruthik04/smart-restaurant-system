package com.restaurant.backend.order.service;

import com.restaurant.backend.order.dto.KitchenOrderItemResponse;
import com.restaurant.backend.order.dto.KitchenOrderResponse;
import com.restaurant.backend.order.model.Order;
import com.restaurant.backend.order.repository.OrderRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class KitchenOrderServiceImpl implements KitchenOrderService {

    private final OrderRepository orderRepository;

    public KitchenOrderServiceImpl(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    @Override
    public List<KitchenOrderResponse> getKitchenQueue() {
        return orderRepository
                .findByStatusInOrderByCreatedAtAsc(List.of("CREATED", "IN_PROGRESS"))
                .stream()
                .map(this::mapToKitchenResponse)
                .toList();
    }

    @Override
    @Transactional
    public void startOrder(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new EntityNotFoundException("Order not found"));

        if (!"CREATED".equals(order.getStatus())) {
            throw new IllegalStateException("Only CREATED orders can be started");
        }

        order.setStatus("IN_PROGRESS");
        orderRepository.save(order);
    }

    @Override
    @Transactional
    public void completeOrder(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new EntityNotFoundException("Order not found"));

        if (!"IN_PROGRESS".equals(order.getStatus())) {
            throw new IllegalStateException("Only IN_PROGRESS orders can be completed");
        }

        order.setStatus("COMPLETED");
        orderRepository.save(order);
    }

    private KitchenOrderResponse mapToKitchenResponse(Order order) {
        var items = order.getItems().stream()
                .map(i -> new KitchenOrderItemResponse(i.getName(), i.getQuantity()))
                .toList();

        return new KitchenOrderResponse(
                order.getId(),
                order.getTableId().intValue(),
                order.getStatus(),
                order.getCreatedAt(),
                items);
    }
}
