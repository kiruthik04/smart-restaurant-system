package com.restaurant.backend.order.service;

import com.restaurant.backend.order.dto.AnalyticsResponse;

public interface AnalyticsService {
    AnalyticsResponse getAnalytics(String range);
}
