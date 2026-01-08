package com.restaurant.backend.reservation.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class MenuItemDto {
    private Long id;
    private String name;
}
