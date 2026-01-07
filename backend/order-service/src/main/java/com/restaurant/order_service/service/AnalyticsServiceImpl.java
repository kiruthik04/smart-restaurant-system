package com.restaurant.order_service.service;

import com.restaurant.order_service.dto.*;
import com.restaurant.order_service.model.Order;
import com.restaurant.order_service.model.OrderItem;
import com.restaurant.order_service.repository.OrderRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AnalyticsServiceImpl implements AnalyticsService {

    private final OrderRepository orderRepository;

    public AnalyticsServiceImpl(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    @Override
    public AnalyticsResponse getAnalytics(String range) {

        LocalDateTime startTime = resolveRange(range);
        List<Order> orders = orderRepository.findByCreatedAtAfter(startTime);

        AnalyticsResponse response = new AnalyticsResponse();

        // -------------------------
        // TOTALS
        // -------------------------
        response.setTotalOrders(orders.size());
        response.setTotalRevenue(
                orders.stream()
                        .mapToDouble(Order::getTotalAmount)
                        .sum()
        );

        // -------------------------
        // MOST ORDERED ITEMS (TOP 5)
        // -------------------------
        Map<String, Long> itemCount = new HashMap<>();

        for (Order order : orders) {
            for (OrderItem item : order.getItems()) {
                itemCount.merge(
                        item.getName(),        // ✅ already correct in your code
                        (long) item.getQuantity(),
                        Long::sum
                );
            }
        }

        List<MostOrderedItemDto> topItems =
                itemCount.entrySet()
                        .stream()
                        .sorted((a, b) -> Long.compare(b.getValue(), a.getValue()))
                        .limit(5)
                        .map(e -> new MostOrderedItemDto(e.getKey(), e.getValue()))
                        .toList();

        response.setMostOrderedItems(topItems);

        // -------------------------
        // PEAK HOURS
        // -------------------------
        Map<Integer, Long> hourCount = new HashMap<>();

        for (Order order : orders) {
            int hour = order.getCreatedAt().getHour();
            hourCount.merge(hour, 1L, Long::sum);
        }

        List<PeakHourDto> peakHours =
                hourCount.entrySet()
                        .stream()
                        .sorted(Map.Entry.comparingByKey())
                        .map(e -> new PeakHourDto(e.getKey(), e.getValue()))
                        .toList();

        response.setPeakHours(peakHours);

        // -------------------------
        // 🔥 REVENUE TIMELINE (NEW)
        // -------------------------
        response.setRevenueTimeline(
                buildRevenueTimeline(orders, range)
        );

        return response;
    }

    // ==================================================
    // RANGE HANDLING (FIXED)
    // ==================================================
    private LocalDateTime resolveRange(String range) {
        return switch (range) {
            case "TODAY" -> LocalDate.now().atStartOfDay();        // ✅ FIXED
            case "LAST_7_DAYS" -> LocalDate.now().minusDays(6).atStartOfDay();
            case "LAST_30_DAYS" -> LocalDate.now().minusDays(29).atStartOfDay();
            default -> throw new IllegalArgumentException("Invalid range");
        };
    }

    // ==================================================
    // REVENUE TIMELINE LOGIC
    // ==================================================
    private List<RevenuePointDto> buildRevenueTimeline(
            List<Order> orders,
            String range
    ) {

        Map<String, Double> revenueMap = new LinkedHashMap<>();

        for (Order order : orders) {

            String label;

            if ("TODAY".equals(range)) {
                // Hour-based
                label = order.getCreatedAt().getHour() + ":00";
            } else {
                // Date-based
                label = order.getCreatedAt().toLocalDate().toString();
            }

            revenueMap.merge(
                    label,
                    order.getTotalAmount(),
                    Double::sum
            );
        }

        return revenueMap.entrySet()
                .stream()
                .map(e -> new RevenuePointDto(e.getKey(), e.getValue()))
                .toList();
    }
}
