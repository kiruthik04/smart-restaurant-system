package com.restaurant.reservation_service.model;

import jakarta.persistence.*;

@Entity
@Table(name = "event_halls")
public class EventHall {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    @Column(nullable = false)
    private int capacity;

    @Column(nullable = false)
    private boolean active = true;

    public EventHall() {}

    public EventHall(String name, int capacity) {
        this.name = name;
        this.capacity = capacity;
        this.active = true;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public int getCapacity() {
        return capacity;
    }

    public boolean isActive() {
        return active;
    }
}
