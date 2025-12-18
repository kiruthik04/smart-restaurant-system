package com.restaurant.reservation_service.service;

import com.restaurant.reservation_service.dto.ReservationRequest;
import com.restaurant.reservation_service.dto.ReservationResponse;
import com.restaurant.reservation_service.dto.SmartReservationRequest;
import com.restaurant.reservation_service.exception.InvalidReservationException;
import com.restaurant.reservation_service.exception.ResourceNotFoundException;
import com.restaurant.reservation_service.exception.TableAlreadyBookedException;
import com.restaurant.reservation_service.exception.ReservationAlreadyCancelledException;
import com.restaurant.reservation_service.model.DiningTable;
import com.restaurant.reservation_service.model.Reservation;
import com.restaurant.reservation_service.repository.DiningTableRepository;
import com.restaurant.reservation_service.repository.ReservationRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class ReservationServiceImpl implements ReservationService {

    private final ReservationRepository reservationRepository;
    private final DiningTableRepository tableRepository;

    public ReservationServiceImpl(
            ReservationRepository reservationRepository,
            DiningTableRepository tableRepository
    ) {
        this.reservationRepository = reservationRepository;
        this.tableRepository = tableRepository;
    }

    @Override
    public ReservationResponse createReservation(ReservationRequest request) {

        DiningTable table = tableRepository.findById(request.getTableId())
                .orElseThrow(() -> new ResourceNotFoundException("Table not found"));

        if (request.getNumberOfPeople() > table.getCapacity()) {
            throw new InvalidReservationException("Table capacity exceeded");
        }

        if (!request.getStartTime().isBefore(request.getEndTime())) {
            throw new InvalidReservationException("Start time must be before end time");
        }

        boolean hasConflict = !reservationRepository
                .findOverlappingReservations(
                        table.getId(),
                        request.getReservationDate(),
                        request.getStartTime(),
                        request.getEndTime()
                ).isEmpty();

        if (hasConflict) {
            throw new TableAlreadyBookedException(
                    "Table is already booked for this time slot"
            );
        }

        Reservation reservation = new Reservation(
                table,
                request.getCustomerName(),
                request.getCustomerPhone(),
                request.getReservationDate(),
                request.getStartTime(),
                request.getEndTime(),
                request.getNumberOfPeople()
        );

        Reservation saved = reservationRepository.save(reservation);
        return mapToResponse(saved);
    }

    @Override
    public ReservationResponse createSmartReservation(SmartReservationRequest request) {

        if (!request.getStartTime().isBefore(request.getEndTime())) {
            throw new InvalidReservationException("Start time must be before end time");
        }

        List<DiningTable> candidateTables =
                tableRepository.findByCapacityGreaterThanEqualAndActiveTrue(
                        request.getNumberOfPeople()
                );

        if (candidateTables.isEmpty()) {
            throw new ResourceNotFoundException(
                    "No tables available for this capacity"
            );
        }

        for (DiningTable table : candidateTables) {

            boolean hasConflict = !reservationRepository
                    .findOverlappingReservations(
                            table.getId(),
                            request.getReservationDate(),
                            request.getStartTime(),
                            request.getEndTime()
                    ).isEmpty();

            if (!hasConflict) {
                Reservation reservation = new Reservation(
                        table,
                        request.getCustomerName(),
                        request.getCustomerPhone(),
                        request.getReservationDate(),
                        request.getStartTime(),
                        request.getEndTime(),
                        request.getNumberOfPeople()
                );

                Reservation saved = reservationRepository.save(reservation);
                return mapToResponse(saved);
            }
        }

        throw new TableAlreadyBookedException(
                "No available tables for the selected time slot"
        );
    }

    @Override
    public void cancelReservation(Long reservationId) {

        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Reservation not found")
                );

        if (reservation.isCancelled()) {
            throw new ReservationAlreadyCancelledException(
                    "Reservation is already cancelled"
            );
        }

        reservation.cancel();
        reservationRepository.save(reservation);
    }

    @Override
    public List<ReservationResponse> getReservationsByDate(String date) {

        LocalDate localDate = LocalDate.parse(date);

        return reservationRepository.findByReservationDate(localDate)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    private ReservationResponse mapToResponse(Reservation r) {
        return new ReservationResponse(
                r.getId(),
                r.getDiningTable().getTableNumber(),
                r.getReservationDate(),
                r.getStartTime(),
                r.getEndTime(),
                r.getStatus()
        );
    }
}
