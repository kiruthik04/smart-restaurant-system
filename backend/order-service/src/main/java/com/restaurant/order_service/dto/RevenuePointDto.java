package com.restaurant.order_service.dto;

public class RevenuePointDto {

    private String label;
    private double amount;

    public RevenuePointDto(String label, double amount) {
        this.label = label;
        this.amount = amount;
    }

    public String getLabel() { return label; }
    public double getAmount() { return amount; }
}
