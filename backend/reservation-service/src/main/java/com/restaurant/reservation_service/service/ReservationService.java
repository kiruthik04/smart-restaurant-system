package com.restaurant.reservation_service.service;

import com.restaurant.reservation_service.dto.ReservationRequest;
import com.restaurant.reservation_service.dto.ReservationResponse;

import java.util.List;

public interface ReservationService {

    ReservationResponse createReservation(ReservationRequest request);

    List<ReservationResponse> getReservationsByDate(String date);
}
