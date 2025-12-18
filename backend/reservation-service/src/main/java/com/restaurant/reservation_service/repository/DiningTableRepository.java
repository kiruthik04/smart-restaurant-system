package com.restaurant.reservation_service.repository;

import com.restaurant.reservation_service.model.DiningTable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DiningTableRepository
        extends JpaRepository<DiningTable, Long> {

    boolean existsByTableNumber(int tableNumber);

    List<DiningTable> findByCapacityGreaterThanEqualAndActiveTrue(int capacity);
}
