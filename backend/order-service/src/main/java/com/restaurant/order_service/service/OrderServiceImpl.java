package com.restaurant.order_service.service;

import com.restaurant.order_service.dto.OrderRequest;
import com.restaurant.order_service.dto.OrderResponse;
import com.restaurant.order_service.dto.MenuItemResponse;
import com.restaurant.order_service.dto.KitchenOrderRequest;
import com.restaurant.order_service.exception.ResourceNotFoundException;
import com.restaurant.order_service.model.Order;
import com.restaurant.order_service.repository.OrderRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.util.List;

@Service
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final RestTemplate restTemplate;

    public OrderServiceImpl(OrderRepository orderRepository, RestTemplate restTemplate) {
        this.orderRepository = orderRepository;
        this.restTemplate = restTemplate;
    }

    @Override
    public OrderResponse placeOrder(OrderRequest request) {

        // TEMP price (will be replaced when we call Menu Service)
        String menuServiceUrl =
                "http://localhost:8081/api/menu/" + request.getMenuItemId();

        MenuItemResponse menuItem =
                restTemplate.getForObject(menuServiceUrl, MenuItemResponse.class);

        if (menuItem == null || !menuItem.isAvailable()) {
            throw new RuntimeException("Menu item not available");
        }

        double totalPrice = menuItem.getPrice() * request.getQuantity();


        Order order = new Order(
                request.getMenuItemId(),
                request.getQuantity(),
                totalPrice,
                "CREATED"
        );

        Order savedOrder = orderRepository.save(order);

        String kitchenServiceUrl = "http://localhost:8083/api/kitchen/start";

        KitchenOrderRequest kitchenRequest =
                new KitchenOrderRequest(savedOrder.getId());

        restTemplate.postForObject(
                kitchenServiceUrl,
                kitchenRequest,
                Void.class
        );

        return mapToResponse(savedOrder);
    }

    @Override
    public List<OrderResponse> getAllOrders() {
        return orderRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public OrderResponse getOrderById(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        return mapToResponse(order);
    }

    private OrderResponse mapToResponse(Order order) {
        return new OrderResponse(
                order.getId(),
                order.getMenuItemId(),
                order.getQuantity(),
                order.getTotalPrice(),
                order.getStatus()
        );
    }
}
