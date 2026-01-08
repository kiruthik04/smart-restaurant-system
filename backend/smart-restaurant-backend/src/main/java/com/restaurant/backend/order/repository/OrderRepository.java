package com.restaurant.backend.order.repository;

import com.restaurant.backend.order.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface OrderRepository extends JpaRepository<Order, Long> {

    List<Order> findByStatus(String status);

    // Changed to Optional for single active order lookup
    Optional<Order> findByTableIdAndStatusNot(Long tableId, String status);

    List<Order> findByCreatedAtAfter(LocalDateTime dateTime);

    List<Order> findByStatusInOrderByCreatedAtAsc(List<String> statuses);

    Optional<Order> findByUserIdAndStatusNot(Long userId, String status);
}
