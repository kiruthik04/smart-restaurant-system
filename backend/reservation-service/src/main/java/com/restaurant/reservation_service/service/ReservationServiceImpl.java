package com.restaurant.reservation_service.service;

import com.restaurant.reservation_service.dto.ReservationRequest;
import com.restaurant.reservation_service.dto.ReservationResponse;
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
                .orElseThrow(() -> new RuntimeException("Table not found"));

        if (request.getNumberOfPeople() > table.getCapacity()) {
            throw new RuntimeException("Table capacity exceeded");
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
