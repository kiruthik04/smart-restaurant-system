package com.restaurant.reservation_service.repository;

import com.restaurant.reservation_service.model.EventHall;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EventHallRepository
        extends JpaRepository<EventHall, Long> {

    List<EventHall> findByCapacityGreaterThanEqualAndActiveTrue(int capacity);
}
