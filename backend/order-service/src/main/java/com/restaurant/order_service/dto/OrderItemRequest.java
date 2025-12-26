package com.restaurant.order_service.dto;

public class OrderItemRequest {
    private Long menuId;
    private int quantity;

    public Long getMenuId(){
        return menuId;
    }
    public int getQuantity(){
        return quantity;
    }
    public void setMenuId(Long menuId){
        this.menuId = menuId;
    }
    public void setQuantity(int quantity){
        this.quantity = quantity;
    }
}
