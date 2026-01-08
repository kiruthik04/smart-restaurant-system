package com.restaurant.backend.reservation.service;

import com.restaurant.backend.reservation.dto.ReservationRequest;
import com.restaurant.backend.reservation.dto.ReservationResponse;
import com.restaurant.backend.reservation.dto.SmartReservationRequest;
import com.restaurant.backend.reservation.dto.TableAvailabilityResponse;

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
            int numberOfPeople);

}
