package com.restaurant.backend.reservation.dto;

import com.restaurant.backend.reservation.model.EventBooking;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class EventResponseDto {

    private Long id;
    private String eventName;
    private LocalDate eventDate;
    private LocalTime startTime;
    private LocalTime endTime;
    private int guestCount;
    private String status;
    private List<String> menuItems;

    public static EventResponseDto fromEntity(EventBooking event) {
        return new EventResponseDto(
                event.getId(),
                event.getEventName(),
                event.getEventDate(),
                event.getStartTime(),
                event.getEndTime(),
                event.getGuestCount(),
                event.getStatus(),
                event.getMenuItems());
    }
}
