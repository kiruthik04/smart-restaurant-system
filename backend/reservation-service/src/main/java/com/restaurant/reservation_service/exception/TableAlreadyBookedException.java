package com.restaurant.reservation_service.exception;

public class TableAlreadyBookedException extends RuntimeException {

    public TableAlreadyBookedException(String message) {
        super(message);
    }
}
