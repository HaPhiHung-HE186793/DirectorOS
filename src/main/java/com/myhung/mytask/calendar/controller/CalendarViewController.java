package com.myhung.mytask.calendar.controller;

import com.myhung.mytask.calendar.service.CalendarAggregatorService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Map;

@RestController
@RequestMapping("/api/calendar")
public class CalendarViewController {

    private final CalendarAggregatorService aggregatorService;

    public CalendarViewController(CalendarAggregatorService aggregatorService) {
        this.aggregatorService = aggregatorService;
    }

    /**
     * Get aggregated calendar data for a given month.
     * Merges: Special Dates + Daily Plans + Synced Email Calendar Events
     */
    @GetMapping("/month")
    public ResponseEntity<Map<String, Object>> getMonthData(
            @RequestParam(required = false) Integer year,
            @RequestParam(required = false) Integer month) {
        LocalDate now = LocalDate.now();
        int y = (year != null) ? year : now.getYear();
        int m = (month != null) ? month : now.getMonthValue();

        return ResponseEntity.ok(aggregatorService.getMonthData(y, m));
    }

    /**
     * Get aggregated calendar data for an entire year.
     * Pre-fetches all 12 months in a single query for maximum performance.
     */
    @GetMapping("/year")
    public ResponseEntity<Map<String, Object>> getYearData(
            @RequestParam(required = false) Integer year) {
        int y = (year != null) ? year : LocalDate.now().getYear();
        return ResponseEntity.ok(aggregatorService.getYearData(y));
    }
}
