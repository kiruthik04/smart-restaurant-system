package com.restaurant.backend.order.service;

import com.restaurant.backend.order.dto.BillResponse;
import com.restaurant.backend.order.dto.OrderItemResponse;
import com.restaurant.backend.order.dto.OrderResponse;
import com.restaurant.backend.order.model.Order;
import com.restaurant.backend.order.repository.OrderRepository;
import com.restaurant.backend.reservation.service.DiningTableService;
import com.restaurant.backend.reservation.model.DiningTable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class BillServiceImpl implements BillService {

    private final OrderRepository orderRepository;
    private final DiningTableService diningTableService;

    public BillServiceImpl(OrderRepository orderRepository, DiningTableService diningTableService) {
        this.orderRepository = orderRepository;
        this.diningTableService = diningTableService;
    }

    @Override
    @Transactional(readOnly = true)
    public BillResponse generateBill(Long tableId) {
        DiningTable table = diningTableService.getEntityById(tableId);

        // Fetch all orders for this table that are NOT completed
        // This assumes "active" session orders are anything not COMPLETED.
        // Ideally we should filter by check session ID matches, but
        // OrderRepository doesn't store session ID in a queryable way easily unless we
        // added it.
        // However, "Status Not Completed" is a good proxy for active session.
        List<Order> orders = orderRepository.findAllByTableIdAndStatusNot(tableId, "COMPLETED");

        BillResponse response = new BillResponse();
        response.setTableNumber(table.getTableNumber());

        double grandTotal = orders.stream()
                .mapToDouble(Order::getTotalAmount)
                .sum();
        response.setGrandTotal(grandTotal);

        List<OrderResponse> orderResponses = orders.stream()
                .map(this::mapToOrderResponse)
                .collect(Collectors.toList());
        response.setOrders(orderResponses);

        return response;
    }

    @Override
    @Transactional(readOnly = true)
    public BillResponse generateBillByTableNumber(Integer tableNumber) {
        DiningTable table = diningTableService.getEntityByTableNumber(tableNumber);
        return generateBill(table.getId());
    }

    private OrderResponse mapToOrderResponse(Order order) {
        OrderResponse response = new OrderResponse();
        response.setOrderId(order.getId());
        response.setStatus(order.getStatus());
        response.setTotalAmount(order.getTotalAmount());

        // We need to set tableNumber, but we already know it from the parent context or
        // fetching
        // This helper is similar to OrderService's but simpler.
        // Let's just fetch it again or ignore since BillResponse has tableNumber
        // globally.
        // Actually, OrderResponse has tableNumber field now.
        // We can leave it 0 or fetch it. Let's fetch to be safe/consistent.
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
                .collect(Collectors.toList());
        response.setItems(itemResponses);

        return response;
    }
}
