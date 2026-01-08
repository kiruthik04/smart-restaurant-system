package com.restaurant.backend.reservation.repository;

import com.restaurant.backend.reservation.model.EventBooking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public interface EventBookingRepository extends JpaRepository<EventBooking, Long> {

    List<EventBooking> findAll();

    @Query("""
                SELECT e FROM EventBooking e
                WHERE e.eventDate = :date
                AND e.status <> 'CANCELLED'
                AND (
                    :startTime < e.endTime AND :endTime > e.startTime
                )
            """)
    List<EventBooking> findOverlappingEvents(
            @Param("date") LocalDate date,
            @Param("startTime") LocalTime startTime,
            @Param("endTime") LocalTime endTime);
}
