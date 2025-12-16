package com.restaurant.order_service.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import org.springframework.web.bind.annotation.PostMapping;

public class OrderRequest{

    @NotNull(message = "Menu item id is required")
    private Long menuItemId;
    @Positive(message = "Quantity must be greater than zero")
    private int quantity;

    public OrderRequest(){
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
    public void setQuantity(){
        this.quantity = quantity;
    }
}