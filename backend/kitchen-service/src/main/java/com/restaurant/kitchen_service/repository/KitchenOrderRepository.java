package com.restaurant.kitchen_service.repository;

import com.restaurant.kitchen_service.model.KitchenOrder;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface KitchenOrderRepository
        extends JpaRepository<KitchenOrder, Long> {

    Optional<KitchenOrder> findByOrderId(Long orderId);
}
