package com.restaurant.reservation_service.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(TableAlreadyBookedException.class)
    public ResponseEntity<?> handleTableAlreadyBooked(
            TableAlreadyBookedException ex) {

        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(Map.of(
                        "timestamp", LocalDateTime.now(),
                        "error", "TABLE_ALREADY_BOOKED",
                        "message", ex.getMessage()
                ));
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<?> handleNotFound(
            ResourceNotFoundException ex) {

        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of(
                        "timestamp", LocalDateTime.now(),
                        "error", "RESOURCE_NOT_FOUND",
                        "message", ex.getMessage()
                ));
    }

    @ExceptionHandler(InvalidReservationException.class)
    public ResponseEntity<?> handleInvalidReservation(
            InvalidReservationException ex) {

        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of(
                        "timestamp", LocalDateTime.now(),
                        "error", "INVALID_RESERVATION",
                        "message", ex.getMessage()
                ));
    }

    @ExceptionHandler(ReservationAlreadyCancelledException.class)
    public ResponseEntity<?> handleAlreadyCancelled(
            ReservationAlreadyCancelledException ex) {

        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(Map.of(
                        "timestamp", LocalDateTime.now(),
                        "error", "RESERVATION_ALREADY_CANCELLED",
                        "message", ex.getMessage()
                ));
    }

}
