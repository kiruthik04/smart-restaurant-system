package com.restaurant.reservation_service.service;

import com.restaurant.reservation_service.dto.DiningTableRequest;
import com.restaurant.reservation_service.dto.DiningTableResponse;
import com.restaurant.reservation_service.exception.ResourceNotFoundException;
import com.restaurant.reservation_service.model.DiningTable;
import com.restaurant.reservation_service.repository.DiningTableRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DiningTableServiceImpl implements DiningTableService {

    private final DiningTableRepository repository;

    public DiningTableServiceImpl(DiningTableRepository repository) {
        this.repository = repository;
    }

    @Override
    public DiningTableResponse createTable(DiningTableRequest request) {

        if (repository.existsByTableNumber(request.getTableNumber())) {
            throw new RuntimeException("Table number already exists");
        }

        DiningTable table = new DiningTable(
                request.getTableNumber(),
                request.getCapacity()
        );

        DiningTable saved = repository.save(table);

        return mapToResponse(saved);
    }

    @Override
    public List<DiningTableResponse> getAllTables() {
        return repository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    private DiningTableResponse mapToResponse(DiningTable table) {
        return new DiningTableResponse(
                table.getId(),
                table.getTableNumber(),
                table.getCapacity(),
                table.isActive()
        );
    }

    // ✅ FIXED METHOD (ONLY THIS PART CHANGED)
    @Override
    public DiningTable getEntityByTableNumber(Integer tableNumber) {
        return repository
                .findByTableNumber(tableNumber)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Table not found"));
    }
}
