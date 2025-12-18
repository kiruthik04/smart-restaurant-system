package com.restaurant.kitchen_service.model;

import jakarta.persistence.*;

@Entity
@Table(name = "kitchen_orders")
public class KitchenOrder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long orderId;   // from Order Service
    private String status;  // COOKING, READY

    public KitchenOrder() {
    }

    public KitchenOrder(Long orderId, String status) {
        this.orderId = orderId;
        this.status = status;
    }

    public Long getId() {
        return id;
    }

    public Long getOrderId() {
        return orderId;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
