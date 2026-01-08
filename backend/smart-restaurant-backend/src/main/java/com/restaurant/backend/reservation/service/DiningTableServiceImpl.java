package com.restaurant.backend.reservation.service;

import com.restaurant.backend.reservation.dto.AdminTableResponse;
import com.restaurant.backend.reservation.dto.DiningTableRequest;
import com.restaurant.backend.reservation.dto.DiningTableResponse;
import com.restaurant.backend.reservation.exception.ResourceNotFoundException;
import com.restaurant.backend.reservation.model.DiningTable;
import com.restaurant.backend.reservation.repository.DiningTableRepository;
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
                request.getCapacity());

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
                table.getCurrentSessionId());
    }

    @Override
    public DiningTable getEntityByTableNumber(Integer tableNumber) {
        return repository
                .findByTableNumber(tableNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Table not found"));
    }

    @Override
    public DiningTable getTableBySessionId(String sessionId) {
        return repository.findByCurrentSessionId(sessionId)
                .orElseThrow(() -> new ResourceNotFoundException("No table found for session: " + sessionId));
    }

    @Override
    @Transactional
    public void claimTable(Long tableId, String orderSessionId) {

        DiningTable table = repository.findById(tableId)
                .orElseThrow(() -> new ResourceNotFoundException("Table not found"));

        if (!table.isEnabled()) {
            throw new IllegalStateException("Table is currently disabled");
        }

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

        table.setCurrentSessionId(null); // 🔓 FREE the table
        table.setActive(false); // optional, based on your meaning
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
                        table.getCurrentSessionId(),
                        table.isEnabled()))
                .toList();
    }

    @Override
    @Transactional
    public void forceReleaseTable(Long tableId) {
        releaseTable(tableId); // reuse existing logic
    }

    @Override
    @Transactional
    public void disableTable(Long tableId) {

        DiningTable table = repository.findById(tableId)
                .orElseThrow(() -> new ResourceNotFoundException("Table not found"));

        if (table.getCurrentSessionId() != null) {
            throw new IllegalStateException("Cannot disable table while in use");
        }

        table.setEnabled(false);
        repository.save(table);
    }

    @Override
    @Transactional
    public void enableTable(Long tableId) {

        DiningTable table = repository.findById(tableId)
                .orElseThrow(() -> new ResourceNotFoundException("Table not found"));

        table.setEnabled(true);
        repository.save(table);
    }

}
