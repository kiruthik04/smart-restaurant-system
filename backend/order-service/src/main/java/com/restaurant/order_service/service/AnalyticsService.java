package com.restaurant.order_service.service;

import com.restaurant.order_service.dto.AnalyticsResponse;

public interface AnalyticsService {
    AnalyticsResponse getAnalytics(String range);
}
