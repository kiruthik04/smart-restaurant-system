package com.restaurant.backend.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // Helper to build response
    private ResponseEntity<?> buildResponse(HttpStatus status, String error, String message) {
        return ResponseEntity.status(status)
                .body(Map.of(
                        "timestamp", LocalDateTime.now(),
                        "status", status.value(),
                        "error", error,
                        "message", message));
    }

    // Handle Menu ResourceNotFound
    @ExceptionHandler(com.restaurant.backend.menu.exception.ResourceNotFoundException.class)
    public ResponseEntity<?> handleMenuNotFound(com.restaurant.backend.menu.exception.ResourceNotFoundException ex) {
        return buildResponse(HttpStatus.NOT_FOUND, "NOT_FOUND", ex.getMessage());
    }

    // Handle Reservation ResourceNotFound
    // (Note: In my migration, I might have used a diff package or same name.
    // Checking Step 229:
    // com.restaurant.backend.reservation.exception.ResourceNotFoundException)
    // Wait, did I create ResourceNotFoundException in reservation package?
    // Step 229 summary says: "Migrated ... ResourceNotFoundException ... to
    // com.restaurant.backend.reservation.exception".

    // Handle Order ResourceNotFound (Step 285 created it in
    // com.restaurant.backend.order.exception)
    @ExceptionHandler(com.restaurant.backend.order.exception.ResourceNotFoundException.class)
    public ResponseEntity<?> handleOrderNotFound(com.restaurant.backend.order.exception.ResourceNotFoundException ex) {
        return buildResponse(HttpStatus.NOT_FOUND, "NOT_FOUND", ex.getMessage());
    }

    @ExceptionHandler(com.restaurant.backend.reservation.exception.ResourceNotFoundException.class)
    public ResponseEntity<?> handleReservationNotFound(
            com.restaurant.backend.reservation.exception.ResourceNotFoundException ex) {
        return buildResponse(HttpStatus.NOT_FOUND, "NOT_FOUND", ex.getMessage());
    }

    // Handle Reservation specific exceptions
    @ExceptionHandler(com.restaurant.backend.reservation.exception.InvalidReservationException.class)
    public ResponseEntity<?> handleInvalidReservation(
            com.restaurant.backend.reservation.exception.InvalidReservationException ex) {
        return buildResponse(HttpStatus.BAD_REQUEST, "BAD_REQUEST", ex.getMessage());
    }

    @ExceptionHandler(com.restaurant.backend.reservation.exception.ReservationAlreadyCancelledException.class)
    public ResponseEntity<?> handleReservationCancelled(
            com.restaurant.backend.reservation.exception.ReservationAlreadyCancelledException ex) {
        return buildResponse(HttpStatus.BAD_REQUEST, "BAD_REQUEST", ex.getMessage());
    }

    @ExceptionHandler(com.restaurant.backend.reservation.exception.TableAlreadyBookedException.class)
    public ResponseEntity<?> handleTableBooked(
            com.restaurant.backend.reservation.exception.TableAlreadyBookedException ex) {
        return buildResponse(HttpStatus.CONFLICT, "CONFLICT", ex.getMessage());
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<?> handleIllegalArgument(IllegalArgumentException ex) {
        return buildResponse(HttpStatus.BAD_REQUEST, "BAD_REQUEST", ex.getMessage());
    }

    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<?> handleIllegalState(IllegalStateException ex) {
        return buildResponse(HttpStatus.BAD_REQUEST, "BAD_REQUEST", ex.getMessage());
    }

    // Generic Exception
    @ExceptionHandler(Exception.class)
    public ResponseEntity<?> handleException(Exception ex) {
        // Log error
        ex.printStackTrace();
        return buildResponse(HttpStatus.INTERNAL_SERVER_ERROR, "INTERNAL_SERVER_ERROR", "An unexpected error occurred");
    }
}
