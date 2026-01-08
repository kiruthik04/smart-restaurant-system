package com.restaurant.backend.kitchen.repository;

import com.restaurant.backend.kitchen.model.KitchenOrder;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface KitchenOrderRepository
        extends JpaRepository<KitchenOrder, Long> {

    Optional<KitchenOrder> findByOrderId(Long orderId);
}
