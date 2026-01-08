package com.restaurant.backend.order.service;

import com.restaurant.backend.order.dto.AdminOrderItemResponse;
import com.restaurant.backend.order.dto.AdminOrderResponse;
import com.restaurant.backend.order.model.Order;
import com.restaurant.backend.order.repository.OrderRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class AdminOrderServiceImpl implements AdminOrderService {

    private final OrderRepository orderRepository;

    public AdminOrderServiceImpl(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    @Override
    public List<AdminOrderResponse> getAllOrders() {
        return orderRepository.findAll()
                .stream()
                .map(this::mapToAdminResponse)
                .toList();
    }

    @Override
    public AdminOrderResponse getOrderById(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new EntityNotFoundException("Order not found"));
        return mapToAdminResponse(order);
    }

    @Override
    @Transactional
    public void markOrderCompleted(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new EntityNotFoundException("Order not found"));

        order.setStatus("COMPLETED");
        orderRepository.save(order);
    }

    private AdminOrderResponse mapToAdminResponse(Order order) {

        List<AdminOrderItemResponse> items = order.getItems()
                .stream()
                .map(i -> new AdminOrderItemResponse(
                        i.getName(),
                        i.getQuantity(),
                        i.getPrice(),
                        i.getSubtotal()))
                .toList();

        return new AdminOrderResponse(
                order.getId(),
                order.getTableId().intValue(),
                order.getTotalAmount(),
                order.getStatus(),
                order.getCreatedAt(),
                items);
    }
}
