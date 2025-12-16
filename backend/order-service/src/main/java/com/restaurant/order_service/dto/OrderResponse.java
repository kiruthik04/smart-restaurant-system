package com.restaurant.order_service.dto;

public class OrderResponse {

    private Long id;
    private Long menuItemId;
    private int quantity;
    private double totalPrice;
    private String status;

    // Constructor used by service layer
    public OrderResponse(Long id, Long menuItemId, int quantity, double totalPrice, String status) {
        this.id = id;
        this.menuItemId = menuItemId;
        this.quantity = quantity;
        this.totalPrice = totalPrice;
        this.status = status;
    }

    public Long getId() {
        return id;
    }

    public Long getMenuItemId() {
        return menuItemId;
    }

    public int getQuantity() {
        return quantity;
    }

    public double getTotalPrice() {
        return totalPrice;
    }

    public String getStatus() {
        return status;
    }
}
