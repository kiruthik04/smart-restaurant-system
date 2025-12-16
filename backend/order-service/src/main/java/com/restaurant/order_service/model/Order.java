package com.restaurant.order_service.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "orders")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long menuItemId;
    private int quantity;
    private double totalPrice;

    private String status; // CREATED, COOKING, READY

    private LocalDateTime createdAt;

    public Order() {}

    public Order(Long menuItemId, int quantity, double totalPrice, String status) {
        this.menuItemId = menuItemId;
        this.quantity = quantity;
        this.totalPrice = totalPrice;
        this.status = status;
        this.createdAt = LocalDateTime.now();
    }

    // getters & setters
    public Long getId(){
        return id;
    }
    public void setId(Long id){
        this.id = id;
    }
    public Long getMenuItemId(){
        return menuItemId;
    }
    public void setMenuItemId(Long menuItemId){
        this.menuItemId = menuItemId;
    }
    public int getQuantity(){
        return quantity;
    }
    public void setQuantity(int quantity){
        this.quantity = quantity;
    }
    public double getTotalPrice(){
        return totalPrice;
    }
    public void setTotalPrice(double totalPrice){
        this.totalPrice = totalPrice;
    }
    public String getStatus(){
        return status;
    }
    public void setStatus(String status){
        this.status = status;
    }
}
