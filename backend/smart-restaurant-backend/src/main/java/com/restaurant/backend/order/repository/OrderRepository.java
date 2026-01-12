package com.restaurant.backend.order.repository;

import com.restaurant.backend.order.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface OrderRepository extends JpaRepository<Order, Long> {

    List<Order> findByStatus(String status);

    // Changed to Optional for single active order lookup
    // Changed to List for multiple active orders (tickets)
    List<Order> findByTableIdAndStatusNot(Long tableId, String status);

    // Added for Billing: Fetch ALL active orders for the table
    List<Order> findAllByTableIdAndStatusNot(Long tableId, String status);

    List<Order> findByCreatedAtAfter(LocalDateTime dateTime);

    List<Order> findByStatusInOrderByCreatedAtAsc(List<String> statuses);

    List<Order> findAllByUserIdAndStatusNot(Long userId, String status);
}
