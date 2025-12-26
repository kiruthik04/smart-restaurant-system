package com.restaurant.order_service.service;

import com.restaurant.order_service.dto.*;
import com.restaurant.order_service.model.Order;
import com.restaurant.order_service.model.OrderItem;
import com.restaurant.order_service.repository.OrderRepository;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;

@Service
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final RestTemplate restTemplate;

    public OrderServiceImpl(OrderRepository orderRepository,
                            RestTemplate restTemplate) {
        this.orderRepository = orderRepository;
        this.restTemplate = restTemplate;
    }

    private TableResponse getTable(int tableNumber) {
        try {
            String url = "http://localhost:8084/api/tables/by-number/" + tableNumber;
            System.out.println("Calling Reservation Service URL: " + url);
            return restTemplate.getForObject(url,
                    TableResponse.class
            );
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Invalid table number");
        }
    }
    private MenuResponse getMenu(Long menuId) {
        try {
            return restTemplate.getForObject(
                    "http://localhost:8081/api/menu/" + menuId,
                    MenuResponse.class
            );
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Invalid menu item");
        }
    }

    @Override
    @Transactional
    public OrderResponse placeOrder(OrderRequest request) {

        try {

            if (request.getItems() == null) {
                request.setItems(new ArrayList<>());
            }

            System.out.println("Order items received: " + request.getItems());

            // 1️⃣ Validate table
            TableResponse table = getTable(request.getTableNumber());

            if (!table.isActive()) {
                throw new IllegalStateException("Table is not active");
            }

            // 2️⃣ Create Order (DO NOT SAVE YET)
            Order order = new Order();
            order.setTableId(table.getId());
            order.setStatus("CREATED");

            double total = 0;

            // 3️⃣ CREATE ORDER ITEMS (THIS IS THE MISSING PART)
            for (OrderItemRequest itemReq : request.getItems()) {

                System.out.println(
                        "Processing item: menuId=" + itemReq.getMenuId() +
                                ", qty=" + itemReq.getQuantity()
                );

                MenuResponse menu = getMenu(itemReq.getMenuId());

                OrderItem item = new OrderItem();
                item.setMenuId(menu.getId());
                item.setName(menu.getName());
                item.setPrice(menu.getPrice());
                item.setQuantity(itemReq.getQuantity());

                double subtotal = menu.getPrice() * itemReq.getQuantity();
                item.setSubtotal(subtotal);

                // 🔴 ABSOLUTELY REQUIRED
                item.setOrder(order);
                order.getItems().add(item);

                total += subtotal;
            }

            // 4️⃣ Set total
            order.setTotalAmount(total);

            // 5️⃣ SAVE ONCE (cascade saves items)
            Order savedOrder = orderRepository.save(order);

            System.out.println("Saved order id: " + savedOrder.getId());
            System.out.println("Saved items count: " + savedOrder.getItems().size());

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

}
