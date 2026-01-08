package com.restaurant.backend.order.controller;

import com.restaurant.backend.order.dto.AnalyticsResponse;
import com.restaurant.backend.order.service.AnalyticsService;
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
            @RequestParam String range) {
        return analyticsService.getAnalytics(range);
    }
}
