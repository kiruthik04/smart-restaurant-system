package com.restaurant.reservation_service.service;

import com.restaurant.reservation_service.dto.ReservationRequest;
import com.restaurant.reservation_service.dto.ReservationResponse;
import com.restaurant.reservation_service.dto.SmartReservationRequest;
import com.restaurant.reservation_service.dto.TableAvailabilityResponse;

import java.util.List;

public interface ReservationService {

    ReservationResponse createReservation(ReservationRequest request);

    List<ReservationResponse> getReservationsByDate(String date);

    ReservationResponse createSmartReservation(SmartReservationRequest request);

    void cancelReservation(Long reservationId);

    List<TableAvailabilityResponse> getTableAvailability(
            String date,
            String startTime,
            String endTime,
            int numberOfPeople
    );

}
