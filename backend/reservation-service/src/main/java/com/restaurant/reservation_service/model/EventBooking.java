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

    private String eventName;

    @Column(nullable = false)
    private LocalDate eventDate;

    @Column(nullable = false)
    private LocalTime startTime;

    @Column(nullable = false)
    private LocalTime endTime;

    private int guestCount;

    private String status;

    @ElementCollection
    @CollectionTable(
            name = "event_menu_items",
            joinColumns = @JoinColumn(name = "event_id")
    )
    @Column(name = "menu_item_name")
    private List<String> menuItems;

    /* ===== Business Methods ===== */

    // ✅ REQUIRED BY JPA
    public EventBooking() {}

    // ✅ FIXED CONSTRUCTOR
    public EventBooking(
            String eventName,
            LocalDate eventDate,
            LocalTime startTime,
            LocalTime endTime,
            int guestCount,
            List<String> menuItems
    ) {
        this.eventName = eventName;
        this.eventDate = eventDate;
        this.startTime = startTime;
        this.endTime = endTime;
        this.guestCount = guestCount;
        this.menuItems = menuItems;
        this.status = "PENDING";
    }

    // ✅ REQUIRED METHOD
    public void cancel() {
        this.status = "CANCELLED";
    }

    /* ===== GETTERS & SETTERS ===== */

    public Long getId() {
        return id;
    }

    public void setId(Long id){
        this.id = id;
    }

    public String getEventName() {
        return eventName;
    }

    public void setEventName(String eventName) {
        this.eventName = eventName;
    }

    public LocalDate getEventDate() {
        return eventDate;
    }

    public void setEventDate(LocalDate eventDate) {
        this.eventDate = eventDate;
    }

    public LocalTime getStartTime() {
        return startTime;
    }

    public void setStartTime(LocalTime startTime) {
        this.startTime = startTime;
    }

    public LocalTime getEndTime() {
        return endTime;
    }

    public void setEndTime(LocalTime endTime) {
        this.endTime = endTime;
    }

    public int getGuestCount() {
        return guestCount;
    }

    public void setGuestCount(int guestCount) {
        this.guestCount = guestCount;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public List<String> getMenuItems() {
        return menuItems;
    }

    public void setMenuItems(List<String> menuItems) {
        this.menuItems = menuItems;
    }

}
