package com.restaurant.backend.reservation.repository;

import com.restaurant.backend.reservation.model.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public interface ReservationRepository
        extends JpaRepository<Reservation, Long> {

    List<Reservation> findByReservationDate(LocalDate date);

    @Query("""
                SELECT r FROM Reservation r
                WHERE r.diningTable.id = :tableId
                  AND r.reservationDate = :date
                  AND r.status = 'BOOKED'
                  AND (:startTime < r.endTime AND :endTime > r.startTime)
            """)
    List<Reservation> findOverlappingReservations(
            @Param("tableId") Long tableId,
            @Param("date") LocalDate date,
            @Param("startTime") LocalTime startTime,
            @Param("endTime") LocalTime endTime);
}
