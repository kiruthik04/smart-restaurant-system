package com.restaurant.backend.order.service;

import com.restaurant.backend.order.dto.BillResponse;

public interface BillService {
    BillResponse generateBill(Long tableId);

    BillResponse generateBillByTableNumber(Integer tableNumber);
}
