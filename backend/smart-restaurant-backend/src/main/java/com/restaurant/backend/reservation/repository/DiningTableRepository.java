package com.restaurant.backend.reservation.repository;

import com.restaurant.backend.reservation.model.DiningTable;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface DiningTableRepository
        extends JpaRepository<DiningTable, Long> {

    boolean existsByTableNumber(int tableNumber);

    List<DiningTable> findByCapacityGreaterThanEqualAndActiveTrue(int capacity);

    Optional<DiningTable> findByTableNumber(Integer tableNumber);

    Optional<DiningTable> findByCurrentSessionId(String currentSessionId);

}
