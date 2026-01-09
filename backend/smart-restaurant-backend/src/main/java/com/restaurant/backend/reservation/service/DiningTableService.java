package com.restaurant.backend.reservation.service;

import com.restaurant.backend.reservation.dto.AdminTableResponse;
import com.restaurant.backend.reservation.dto.DiningTableRequest;
import com.restaurant.backend.reservation.dto.DiningTableResponse;
import com.restaurant.backend.reservation.model.DiningTable;

import java.util.List;

public interface DiningTableService {

    DiningTableResponse createTable(DiningTableRequest request);

    List<DiningTableResponse> getAllTables();

    DiningTable getEntityByTableNumber(Integer tableNumber);

    DiningTable getEntityById(Long id); // Added for internal use

    DiningTable getTableBySessionId(String sessionId);

    void claimTable(Long tableId, String orderSessionId);

    void releaseTable(Long tableId);

    List<AdminTableResponse> getAllTablesForAdmin();

    void forceReleaseTable(Long tableId);

    void disableTable(Long tableId);

    void enableTable(Long tableId);
}
