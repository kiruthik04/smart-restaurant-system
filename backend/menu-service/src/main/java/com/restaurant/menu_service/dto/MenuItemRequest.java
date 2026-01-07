package com.restaurant.menu_service.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import org.springframework.web.bind.annotation.PostMapping;

public class MenuItemRequest {

    @NotBlank(message = "Name must not be empty")
    private String name;
    private String category;
    @NotBlank(message = "Description must not be empty")
    private String description;

    @Positive(message = "Price must be greater than zero")
    private double price;

    private boolean available;

    public MenuItemRequest() {

    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCategory(){
        return category;
    }

    public void setCategory(){
        this.category = category;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description){
        this.description = description;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price){
        this.price = price;
    }

    public boolean isAvailable() {
        return available;
    }

    public void setAvailable(boolean available){
        this.available = available;
    }
}