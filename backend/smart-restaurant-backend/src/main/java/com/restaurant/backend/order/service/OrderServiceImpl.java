package com.restaurant.backend.order.service;

import com.restaurant.backend.order.dto.*;
import com.restaurant.backend.order.model.Order;
import com.restaurant.backend.order.model.OrderItem;
import com.restaurant.backend.order.repository.OrderRepository;
import com.restaurant.backend.order.exception.ResourceNotFoundException;
import com.restaurant.backend.reservation.model.DiningTable;
import com.restaurant.backend.reservation.service.DiningTableService;
import com.restaurant.backend.menu.service.MenuService;
import com.restaurant.backend.menu.dto.MenuItemResponse;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final DiningTableService diningTableService;
    private final MenuService menuService;

    public OrderServiceImpl(
            OrderRepository orderRepository,
            DiningTableService diningTableService,
            MenuService menuService) {
        this.orderRepository = orderRepository;
        this.diningTableService = diningTableService;
        this.menuService = menuService;
    }

    @Override
    @Transactional
    public OrderResponse placeOrder(OrderRequest request) {

        try {

            if (request.getItems() == null) {
                request.setItems(new ArrayList<>());
            }

            // 1️⃣ Validate table (Direct Call)
            // This throws exception if not found, which handles validity check
            DiningTable table = diningTableService.getEntityByTableNumber(request.getTableNumber());

            String incomingSession = request.getOrderSessionId();
            String currentOwner = table.getCurrentSessionId();

            if (currentOwner != null && !currentOwner.equals(incomingSession)) {
                // Check if we can reclaim the table
                List<Order> activeOrders = orderRepository.findByTableIdAndStatusNot(table.getId(), "COMPLETED");

                if (activeOrders.isEmpty()) {
                    // Scenario A: Locked but empty (Zombie session) -> Reclaim
                    diningTableService.claimTable(table.getId(), incomingSession);
                } else {
                    // Scenario B: Active orders exist -> Check User Match
                    boolean sameUser = false;
                    if (request.getUserId() != null) {
                        // Check ownership of the first active order
                        Long activeUserId = activeOrders.get(0).getUserId();
                        if (activeUserId != null && activeUserId.equals(request.getUserId())) {
                            sameUser = true;
                        }
                    }

                    if (sameUser) {
                        // Reclaim for same user (e.g. they logged out and back in)
                        diningTableService.claimTable(table.getId(), incomingSession);
                    } else {
                        throw new IllegalStateException("Table is currently in use by another customer");
                    }
                }
            }

            // 2️⃣ Create Order (DO NOT SAVE YET)
            Order order = new Order();
            order.setTableId(table.getId());
            order.setStatus("CREATED");

            // Link to user if present
            if (request.getUserId() != null) {
                order.setUserId(request.getUserId());
            }

            double total = 0;

            // 3️⃣ CREATE ORDER ITEMS
            for (OrderItemRequest itemReq : request.getItems()) {

                // Retrieve Menu Item (Direct Call)
                MenuItemResponse menu = menuService.getMenuItemById(itemReq.getMenuId());

                OrderItem item = new OrderItem();
                item.setMenuId(menu.getId());
                item.setName(menu.getName());
                item.setPrice(menu.getPrice());
                item.setQuantity(itemReq.getQuantity());

                double subtotal = menu.getPrice() * itemReq.getQuantity();
                item.setSubtotal(subtotal);

                item.setOrder(order);
                order.getItems().add(item);

                total += subtotal;
            }

            // 4️⃣ Set total
            order.setTotalAmount(total);

            // 5️⃣ SAVE ONCE (cascade saves items)
            Order savedOrder = orderRepository.save(order);

            // 6️⃣ CLAIM TABLE (ONLY IF FIRST TIME)
            if (currentOwner == null) {
                diningTableService.claimTable(table.getId(), incomingSession);
            }

            // 6️⃣ Response
            OrderResponse response = new OrderResponse();
            response.setOrderId(savedOrder.getId());
            response.setStatus(savedOrder.getStatus());
            response.setTotalAmount(savedOrder.getTotalAmount());

            return response;

        } catch (Exception e) {
            e.printStackTrace();
            throw e;
        }
    }

    @Override
    public OrderResponse getOrderBySession(String sessionId) {
        // 1. Find the table associated with this session (Direct Call)
        DiningTable table = diningTableService.getTableBySessionId(sessionId);
        // getTableBySessionId throws ResourceNotFoundException if not found, so we
        // don't need null check here

        // 2. Find the active orders for this tableId
        List<Order> orders = orderRepository.findByTableIdAndStatusNot(table.getId(), "COMPLETED");

        if (orders.isEmpty()) {
            throw new ResourceNotFoundException("No active order for this session");
        }

        // Return the most recent order for the status check
        // (Assuming ID increments, last one is newest)
        Order latestOrder = orders.get(orders.size() - 1);

        return mapToOrderResponse(latestOrder);
    }

    @Override
    public List<OrderResponse> getActiveOrdersByUser(Long userId) {
        List<Order> orders = orderRepository.findAllByUserIdAndStatusNot(userId, "COMPLETED");

        if (orders.isEmpty()) {
            // Optional: throw exception or return empty list
            // Returning empty list is better for "History/Dashboard" view implies nothing
            // active
            return new ArrayList<>();
        }

        return orders.stream()
                .map(this::mapToOrderResponse)
                .toList();
    }

    private OrderResponse mapToOrderResponse(Order order) {
        OrderResponse response = new OrderResponse();
        response.setOrderId(order.getId());
        response.setStatus(order.getStatus());
        response.setTotalAmount(order.getTotalAmount());

        // Fetch table number
        DiningTable table = diningTableService.getEntityById(order.getTableId());
        response.setTableNumber(table.getTableNumber());

        var itemResponses = order.getItems().stream()
                .map(i -> {
                    OrderItemResponse ir = new OrderItemResponse();
                    ir.setName(i.getName());
                    ir.setQuantity(i.getQuantity());
                    ir.setPrice(i.getPrice());
                    ir.setSubtotal(i.getSubtotal());
                    return ir;
                })
                .toList();
        response.setItems(itemResponses);

        return response;
    }

}
