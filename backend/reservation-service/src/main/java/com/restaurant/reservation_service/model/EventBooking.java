package com.restaurant.reservation_service.model;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Entity
@Table(name = "event_bookings")
public class EventBooking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String eventName;

    @ManyToOne
    @JoinColumn(name = "hall_id", nullable = false)
    private EventHall hall;

    @Column(nullable = false)
    private LocalDate eventDate;

    @Column(nullable = false)
    private LocalTime startTime;

    @Column(nullable = false)
    private LocalTime endTime;

    @Column(nullable = false)
    private int guestCount;

    @ElementCollection
    @CollectionTable(
            name = "event_menu_items",
            joinColumns = @JoinColumn(name = "event_booking_id")
    )
    @Column(name = "menu_item_id")
    private List<Long> menuItemIds;

    @Column(nullable = false)
    private String status; // BOOKED, CANCELLED

    public EventBooking() {}

    public EventBooking(
            String eventName,
            EventHall hall,
            LocalDate eventDate,
            LocalTime startTime,
            LocalTime endTime,
            int guestCount,
            List<Long> menuItemIds
    ) {
        this.eventName = eventName;
        this.hall = hall;
        this.eventDate = eventDate;
        this.startTime = startTime;
        this.endTime = endTime;
        this.guestCount = guestCount;
        this.menuItemIds = menuItemIds;
        this.status = "BOOKED";
    }

    public Long getId() {
        return id;
    }

    public EventHall getHall() {
        return hall;
    }

    public LocalDate getEventDate() {
        return eventDate;
    }

    public LocalTime getStartTime() {
        return startTime;
    }

    public LocalTime getEndTime() {
        return endTime;
    }

    public int getGuestCount() {
        return guestCount;
    }

    public String getStatus() {
        return status;
    }

    public void cancel() {
        this.status = "CANCELLED";
    }
}
