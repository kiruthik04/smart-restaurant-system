package com.restaurant.reservation_service.service;

import com.restaurant.reservation_service.dto.DiningTableRequest;
import com.restaurant.reservation_service.dto.DiningTableResponse;

import java.util.List;

public interface DiningTableService {

    DiningTableResponse createTable(DiningTableRequest request);

    List<DiningTableResponse> getAllTables();
}
