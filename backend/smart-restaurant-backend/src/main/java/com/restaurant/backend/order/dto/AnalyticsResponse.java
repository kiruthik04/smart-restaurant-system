package com.restaurant.backend.order.dto;

import java.util.List;

public class AnalyticsResponse {

    private List<MostOrderedItemDto> mostOrderedItems;
    private List<PeakHourDto> peakHours;
    private List<RevenuePointDto> revenueTimeline;
    private long totalOrders;
    private double totalRevenue;

    public List<MostOrderedItemDto> getMostOrderedItems() {
        return mostOrderedItems;
    }

    public void setMostOrderedItems(List<MostOrderedItemDto> mostOrderedItems) {
        this.mostOrderedItems = mostOrderedItems;
    }

    public List<PeakHourDto> getPeakHours() {
        return peakHours;
    }

    public void setPeakHours(List<PeakHourDto> peakHours) {
        this.peakHours = peakHours;
    }

    public List<RevenuePointDto> getRevenueTimeline() {
        return revenueTimeline;
    }

    public void setRevenueTimeline(List<RevenuePointDto> revenueTimeline) {
        this.revenueTimeline = revenueTimeline;
    }

    public long getTotalOrders() {
        return totalOrders;
    }

    public void setTotalOrders(long totalOrders) {
        this.totalOrders = totalOrders;
    }

    public double getTotalRevenue() {
        return totalRevenue;
    }

    public void setTotalRevenue(double totalRevenue) {
        this.totalRevenue = totalRevenue;
    }
}
