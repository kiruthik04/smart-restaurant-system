package com.restaurant.reservation_service.service;

import com.restaurant.reservation_service.dto.AdminTableResponse;
import com.restaurant.reservation_service.dto.DiningTableRequest;
import com.restaurant.reservation_service.dto.DiningTableResponse;
import com.restaurant.reservation_service.model.DiningTable;

import java.util.List;

public interface DiningTableService {

    DiningTableResponse createTable(DiningTableRequest request);

    List<DiningTableResponse> getAllTables();

    DiningTable getEntityByTableNumber(Integer tableNumber);

    void claimTable(Long tableId, String orderSessionId);

    void releaseTable(Long tableId);

    List<AdminTableResponse> getAllTablesForAdmin();
    void forceReleaseTable(Long tableId);

}
