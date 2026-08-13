package com.myhung.mytask.calendar.service;

import com.myhung.mytask.calendar.dto.CalendarEvent;
import com.myhung.mytask.calendar.entity.ConnectedCalendar;
import com.myhung.mytask.calendar.repository.ConnectedCalendarRepository;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class ConnectedCalendarService {

    private static final Logger log = LoggerFactory.getLogger(ConnectedCalendarService.class);
    private final ConnectedCalendarRepository repository;
    private final ICalParserService iCalParserService;

    public ConnectedCalendarService(ConnectedCalendarRepository repository, ICalParserService iCalParserService) {
        this.repository = repository;
        this.iCalParserService = iCalParserService;
    }

    public List<ConnectedCalendar> getAllCalendars() {
        return repository.findAll();
    }

    public ConnectedCalendar addCalendar(ConnectedCalendar calendar) {
        if (calendar.getCreatedAt() == null) {
            calendar.setCreatedAt(LocalDateTime.now());
        }
        if (calendar.getSyncEnabled() == null) {
            calendar.setSyncEnabled(true);
        }
        if (calendar.getColorTag() == null || calendar.getColorTag().isBlank()) {
            calendar.setColorTag("#3b82f6");
        }
        calendar.setLastSyncedAt(LocalDateTime.now());
        return repository.save(calendar);
    }

    public void deleteCalendar(Long id) {
        repository.deleteById(id);
    }

    public Map<String, Object> syncAndDetectConflicts() {
        List<ConnectedCalendar> activeCalendars = repository.findBySyncEnabledTrue();
        List<CalendarEvent> allEvents = new ArrayList<>();

        for (ConnectedCalendar cal : activeCalendars) {
            cal.setLastSyncedAt(LocalDateTime.now());
            repository.save(cal);

            if (cal.getSyncUrl() != null && !cal.getSyncUrl().isBlank()) {
                List<CalendarEvent> parsed = iCalParserService.fetchAndParseICal(cal.getSyncUrl(), cal.getAccountName(), cal.getEmailAddress());
                allEvents.addAll(parsed);
            }
        }

        List<Map<String, Object>> conflicts = new ArrayList<>();
        DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("HH:mm");

        // Real Interval Overlap Detection Algorithm: O(N^2) for N events
        for (int i = 0; i < allEvents.size(); i++) {
            for (int j = i + 1; j < allEvents.size(); j++) {
                CalendarEvent evA = allEvents.get(i);
                CalendarEvent evB = allEvents.get(j);

                // Ignore events from the exact same email account
                if (evA.getEmailAddress().equalsIgnoreCase(evB.getEmailAddress())) {
                    continue;
                }

                if (evA.overlapsWith(evB)) {
                    Map<String, Object> conflict = new HashMap<>();
                    conflict.put("id", 100 + conflicts.size() + 1);

                    LocalDateTime startOverlap = evA.getStart().isAfter(evB.getStart()) ? evA.getStart() : evB.getStart();
                    LocalDateTime endOverlap = evA.getEnd().isBefore(evB.getEnd()) ? evA.getEnd() : evB.getEnd();

                    conflict.put("timeSlot", startOverlap.format(timeFormatter) + " - " + endOverlap.format(timeFormatter));
                    conflict.put("accountA", evA.getAccountName() + " (" + evA.getEmailAddress() + ")");
                    conflict.put("eventA", evA.getSummary());
                    conflict.put("accountB", evB.getAccountName() + " (" + evB.getEmailAddress() + ")");
                    conflict.put("eventB", evB.getSummary());
                    conflict.put("severity", "HIGH");
                    conflict.put("suggestion", "Nên đề xuất dời cuộc họp bên " + evB.getAccountName() + " sang khung giờ trống kế tiếp.");

                    conflicts.add(conflict);
                }
            }
        }

        Map<String, Object> result = new HashMap<>();
        result.put("syncedCount", activeCalendars.size());
        result.put("lastSyncedAt", LocalDateTime.now().toString());
        result.put("hasConflicts", !conflicts.isEmpty());
        result.put("conflictsCount", conflicts.size());
        result.put("conflicts", conflicts);

        log.info("Multi-account calendar sync completed for {} active accounts. Parsed {} events. Found {} conflicts.",
                activeCalendars.size(), allEvents.size(), conflicts.size());

        return result;
    }
}
