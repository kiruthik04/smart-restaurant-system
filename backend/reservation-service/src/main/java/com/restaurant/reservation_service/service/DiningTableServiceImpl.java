package com.restaurant.reservation_service.service;

import com.restaurant.reservation_service.dto.AdminTableResponse;
import com.restaurant.reservation_service.dto.DiningTableRequest;
import com.restaurant.reservation_service.dto.DiningTableResponse;
import com.restaurant.reservation_service.exception.ResourceNotFoundException;
import com.restaurant.reservation_service.model.DiningTable;
import com.restaurant.reservation_service.repository.DiningTableRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
                table.isActive(),
                table.getCurrentSessionId()
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

    @Override
    @Transactional
    public void claimTable(Long tableId, String orderSessionId) {

        DiningTable table = repository.findById(tableId)
                .orElseThrow(() -> new ResourceNotFoundException("Table not found"));

        // 🟢 CASE 1: Table is FREE
        if (table.getCurrentSessionId() == null) {
            table.setCurrentSessionId(orderSessionId);
            table.setActive(true); // BOOKED
            repository.save(table);
            return;
        }

        // 🟡 CASE 2: Same session (idempotent)
        if (table.getCurrentSessionId().equals(orderSessionId)) {
            return; // already owned by same session
        }

        // 🔴 CASE 3: Different session
        throw new IllegalStateException("Table already claimed by another session");
    }

    @Override
    @Transactional
    public void releaseTable(Long tableId) {

        DiningTable table = repository.findById(tableId)
                .orElseThrow(() -> new ResourceNotFoundException("Table not found"));

        table.setCurrentSessionId(null);  // 🔓 FREE the table
        table.setActive(false);           // optional, based on your meaning
        repository.save(table);
    }

    @Override
    public List<AdminTableResponse> getAllTablesForAdmin() {
        return repository.findAll()
                .stream()
                .map(table -> new AdminTableResponse(
                        table.getId(),
                        table.getTableNumber(),
                        table.getCapacity(),
                        table.getCurrentSessionId() != null,
                        table.getCurrentSessionId()
                ))
                .toList();
    }

    @Override
    @Transactional
    public void forceReleaseTable(Long tableId) {
        releaseTable(tableId); // reuse existing logic
    }

}
