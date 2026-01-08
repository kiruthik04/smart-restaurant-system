package com.restaurant.backend.reservation.exception;

public class TableAlreadyBookedException extends RuntimeException {

    public TableAlreadyBookedException(String message) {
        super(message);
    }
}
