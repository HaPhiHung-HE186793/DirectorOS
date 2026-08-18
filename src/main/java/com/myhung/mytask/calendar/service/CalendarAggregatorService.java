package com.myhung.mytask.calendar.service;

import com.myhung.mytask.calendar.dto.CalendarEvent;
import com.myhung.mytask.calendar.entity.ConnectedCalendar;
import com.myhung.mytask.calendar.entity.SpecialDate;
import com.myhung.mytask.calendar.repository.ConnectedCalendarRepository;
import com.myhung.mytask.plan.entity.DailyPlan;
import com.myhung.mytask.plan.entity.PlanItem;
import com.myhung.mytask.plan.repository.DailyPlanRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

/**
 * Aggregates all calendar sources (Special Dates, Daily Plans, Synced Email Calendars)
 * into a unified month view for the Calendar UI.
 */
@Service
public class CalendarAggregatorService {

    private static final Logger log = LoggerFactory.getLogger(CalendarAggregatorService.class);

    private final SpecialDateService specialDateService;
    private final DailyPlanRepository dailyPlanRepository;
    private final ConnectedCalendarRepository connectedCalendarRepository;
    private final ICalParserService iCalParserService;

    public CalendarAggregatorService(SpecialDateService specialDateService,
                                      DailyPlanRepository dailyPlanRepository,
                                      ConnectedCalendarRepository connectedCalendarRepository,
                                      ICalParserService iCalParserService) {
        this.specialDateService = specialDateService;
        this.dailyPlanRepository = dailyPlanRepository;
        this.connectedCalendarRepository = connectedCalendarRepository;
        this.iCalParserService = iCalParserService;
    }

    /**
     * Get aggregated calendar data for an entire year (12 months).
     * Enables full-year client caching and zero-delay month switching.
     */
    public Map<String, Object> getYearData(int year) {
        Map<String, List<Map<String, Object>>> dayEvents = new LinkedHashMap<>();
        int totalSpecial = 0;
        int totalPlans = 0;
        int totalSynced = 0;

        for (int m = 1; m <= 12; m++) {
            Map<String, Object> mData = getMonthData(year, m);
            totalSpecial += (int) mData.getOrDefault("totalSpecialDates", 0);
            totalPlans += (int) mData.getOrDefault("totalPlanItems", 0);
            totalSynced += (int) mData.getOrDefault("totalSyncedEvents", 0);

            @SuppressWarnings("unchecked")
            Map<String, List<Map<String, Object>>> mDayEvents = (Map<String, List<Map<String, Object>>>) mData.get("dayEvents");
            if (mDayEvents != null) {
                dayEvents.putAll(mDayEvents);
            }
        }

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("year", year);
        result.put("totalSpecialDates", totalSpecial);
        result.put("totalPlanItems", totalPlans);
        result.put("totalSyncedEvents", totalSynced);
        result.put("dayEvents", dayEvents);
        return result;
    }

    /**
     * Get aggregated calendar data for a given month.
     * Returns a map with all events organized by date.
     */
    public Map<String, Object> getMonthData(int year, int month) {
        LocalDate startDate = LocalDate.of(year, month, 1);
        LocalDate endDate = startDate.withDayOfMonth(startDate.lengthOfMonth());

        // 1. Special Dates (birthdays, holidays, etc.)
        List<SpecialDate> specialDates = specialDateService.getEventsForMonth(year, month);
        List<Map<String, Object>> specialDateEvents = specialDates.stream()
                .map(this::mapSpecialDate)
                .toList();

        // 2. Daily Plans for this month
        List<Map<String, Object>> planEvents = new ArrayList<>();
        for (LocalDate date = startDate; !date.isAfter(endDate); date = date.plusDays(1)) {
            Optional<DailyPlan> planOpt = dailyPlanRepository.findByPlanDate(date);
            if (planOpt.isPresent()) {
                DailyPlan plan = planOpt.get();
                for (PlanItem item : plan.getItems()) {
                    Map<String, Object> event = new LinkedHashMap<>();
                    event.put("id", "plan-" + item.getId());
                    event.put("date", plan.getPlanDate().toString());
                    event.put("title", item.getTask().getTitle());
                    event.put("type", "PLAN");
                    event.put("color", "#3b82f6");
                    event.put("scheduledTime", item.getScheduledTime());
                    event.put("plannedMinutes", item.getPlannedMinutes());
                    event.put("done", item.isDone());
                    event.put("taskId", item.getTask().getId());
                    planEvents.add(event);
                }
            }
        }

        // 3. Synced Email Calendar Events
        List<Map<String, Object>> syncedEvents = new ArrayList<>();
        List<ConnectedCalendar> activeCalendars = connectedCalendarRepository.findBySyncEnabledTrue();
        for (ConnectedCalendar cal : activeCalendars) {
            if (cal.getSyncUrl() != null && !cal.getSyncUrl().isBlank()) {
                List<CalendarEvent> parsed = iCalParserService.fetchAndParseICal(
                        cal.getSyncUrl(), cal.getAccountName(), cal.getEmailAddress());
                for (CalendarEvent ce : parsed) {
                    // Filter events for this month
                    if (ce.getStart() != null &&
                        ce.getStart().getMonthValue() == month &&
                        ce.getStart().getYear() == year) {
                        Map<String, Object> event = new LinkedHashMap<>();
                        event.put("id", "sync-" + cal.getId() + "-" + ce.hashCode());
                        event.put("date", ce.getStart().toLocalDate().toString());
                        event.put("title", ce.getSummary());
                        event.put("type", "SYNCED");
                        event.put("color", cal.getColorTag());
                        event.put("startTime", ce.getStart().toLocalTime().toString());
                        event.put("endTime", ce.getEnd().toLocalTime().toString());
                        event.put("accountName", cal.getAccountName());
                        event.put("location", ce.getLocation());
                        syncedEvents.add(event);
                    }
                }
            }
        }

        // 4. Build day-by-day map
        Map<String, List<Map<String, Object>>> dayEvents = new LinkedHashMap<>();
        for (LocalDate date = startDate; !date.isAfter(endDate); date = date.plusDays(1)) {
            dayEvents.put(date.toString(), new ArrayList<>());
        }

        // Add special dates to day map
        for (Map<String, Object> ev : specialDateEvents) {
            String originalDate = (String) ev.get("date");
            // For recurring events, map to current year's date
            String monthDay = originalDate.substring(5); // "MM-dd"
            String currentYearDate = year + "-" + monthDay;
            if (dayEvents.containsKey(currentYearDate)) {
                dayEvents.get(currentYearDate).add(ev);
            }
        }

        // Add plan events
        for (Map<String, Object> ev : planEvents) {
            String dateStr = (String) ev.get("date");
            if (dayEvents.containsKey(dateStr)) {
                dayEvents.get(dateStr).add(ev);
            }
        }

        // Add synced events
        for (Map<String, Object> ev : syncedEvents) {
            String dateStr = (String) ev.get("date");
            if (dayEvents.containsKey(dateStr)) {
                dayEvents.get(dateStr).add(ev);
            }
        }

        // 5. Build response
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("year", year);
        result.put("month", month);
        result.put("totalSpecialDates", specialDateEvents.size());
        result.put("totalPlanItems", planEvents.size());
        result.put("totalSyncedEvents", syncedEvents.size());
        result.put("dayEvents", dayEvents);

        log.info("Calendar aggregation for {}/{}: {} special dates, {} plan items, {} synced events",
                year, month, specialDateEvents.size(), planEvents.size(), syncedEvents.size());

        return result;
    }

    private Map<String, Object> mapSpecialDate(SpecialDate sd) {
        Map<String, Object> event = new LinkedHashMap<>();
        event.put("id", "special-" + sd.getId());
        event.put("specialDateId", sd.getId());
        event.put("date", sd.getEventDate().toString());
        event.put("title", sd.getTitle());
        event.put("type", "SPECIAL");
        event.put("eventType", sd.getEventType());
        event.put("color", sd.getColor());
        event.put("icon", sd.getIcon());
        event.put("recurringYearly", sd.getRecurringYearly());
        event.put("isLunarBased", sd.getIsLunarBased());
        event.put("lunarDay", sd.getLunarDay());
        event.put("lunarMonth", sd.getLunarMonth());
        event.put("note", sd.getNote());
        return event;
    }
}
