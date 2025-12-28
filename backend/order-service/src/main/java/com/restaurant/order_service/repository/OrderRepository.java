package com.restaurant.order_service.repository;

import com.restaurant.order_service.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByStatusInOrderByCreatedAtAsc(List<String> statuses);
}
