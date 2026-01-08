package com.restaurant.backend.reservation.exception;

public class ReservationAlreadyCancelledException extends RuntimeException {

    public ReservationAlreadyCancelledException(String message) {
        super(message);
    }
}
