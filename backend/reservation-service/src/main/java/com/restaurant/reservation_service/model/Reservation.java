package com.restaurant.reservation_service.model;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "reservations")
public class Reservation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Many reservations can belong to one table
    @ManyToOne
    @JoinColumn(name = "table_id", nullable = false)
    private DiningTable diningTable;

    @Column(nullable = false)
    private String customerName;

    @Column(nullable = false)
    private String customerPhone;

    @Column(nullable = false)
    private LocalDate reservationDate;

    @Column(nullable = false)
    private LocalTime startTime;

    @Column(nullable = false)
    private LocalTime endTime;

    @Column(nullable = false)
    private int numberOfPeople;

    @Column(nullable = false)
    private String status; // BOOKED, CANCELLED

    public Reservation() {
    }

    public Reservation(
            DiningTable diningTable,
            String customerName,
            String customerPhone,
            LocalDate reservationDate,
            LocalTime startTime,
            LocalTime endTime,
            int numberOfPeople
    ) {
        this.diningTable = diningTable;
        this.customerName = customerName;
        this.customerPhone = customerPhone;
        this.reservationDate = reservationDate;
        this.startTime = startTime;
        this.endTime = endTime;
        this.numberOfPeople = numberOfPeople;
        this.status = "BOOKED";
    }

    public Long getId() {
        return id;
    }

    public DiningTable getDiningTable() {
        return diningTable;
    }

    public LocalDate getReservationDate() {
        return reservationDate;
    }

    public LocalTime getStartTime() {
        return startTime;
    }

    public LocalTime getEndTime() {
        return endTime;
    }

    public int getNumberOfPeople() {
        return numberOfPeople;
    }

    public String getStatus() {
        return status;
    }

    public void cancel() {
        this.status = "CANCELLED";
    }

    public boolean isCancelled() {
        return "CANCELLED".equals(this.status);
    }
}
