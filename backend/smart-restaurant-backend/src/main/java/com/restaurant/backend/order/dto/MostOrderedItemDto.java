package com.restaurant.backend.order.dto;

public class MostOrderedItemDto {

    private String name;
    private long count;

    public MostOrderedItemDto(String name, long count) {
        this.name = name;
        this.count = count;
    }

    public String getName() {
        return name;
    }

    public long getCount() {
        return count;
    }
}
