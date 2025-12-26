package com.restaurant.order_service.dto;

public class OrderItemResponse {
    private String name;
    private int quantity;
    private double price;
    private double subtotal;

    public String getName(){
        return name;
    }
    public int getQuantity(){
        return quantity;
    }
    public double getPrice(){
        return price;
    }
    public double getSubtotal(){
        return subtotal;
    }

    public void setName(String name){
        this.name = name;
    }
    public void setQuantity(int quantity){
        this.quantity = quantity;
    }
    public void setPrice(double price){
        this.price = price;
    }
    public void setSubtotal(double subtotal){
        this.subtotal = subtotal;
    }
}
