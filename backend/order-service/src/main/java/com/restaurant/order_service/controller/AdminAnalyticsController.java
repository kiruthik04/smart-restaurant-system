package com.restaurant.order_service.controller;

import com.restaurant.order_service.dto.AnalyticsResponse;
import com.restaurant.order_service.service.AnalyticsService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/analytics")
public class AdminAnalyticsController {

    private final AnalyticsService analyticsService;

    public AdminAnalyticsController(AnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    @GetMapping
    public AnalyticsResponse getAnalytics(
            @RequestParam String range
    ) {
        return analyticsService.getAnalytics(range);
    }
}
