package com.restaurant.order_service.dto;

public class PeakHourDto {

    private int hour;
    private long orders;

    public PeakHourDto(int hour, long orders) {
        this.hour = hour;
        this.orders = orders;
    }

    public int getHour() {
        return hour;
    }

    public long getOrders() {
        return orders;
    }
}
