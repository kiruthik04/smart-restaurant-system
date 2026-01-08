package com.restaurant.backend.reservation.repository;

import com.restaurant.backend.reservation.model.EventHall;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EventHallRepository
        extends JpaRepository<EventHall, Long> {

    List<EventHall> findByCapacityGreaterThanEqualAndActiveTrue(int capacity);
}
