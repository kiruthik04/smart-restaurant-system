package com.restaurant.order_service.repository;

import com.restaurant.order_service.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByStatusInOrderByCreatedAtAsc(List<String> statuses);
    List<Order> findByCreatedAtAfter(LocalDateTime start);
    List<Order> findByCreatedAtBetween(
            LocalDateTime start,
            LocalDateTime end
    );
    Optional<Order> findByTableIdAndStatusNot(Long tableId, String status);
}
