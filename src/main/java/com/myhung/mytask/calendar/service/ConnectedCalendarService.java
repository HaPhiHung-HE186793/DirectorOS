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
        if (calendar.getSyncUrl() != null && !calendar.getSyncUrl().isBlank()) {
            calendar.setSyncUrl(iCalParserService.normalizeICalUrl(calendar.getSyncUrl()));
        }
        calendar.setLastSyncedAt(LocalDateTime.now());
        return repository.save(calendar);
    }

    public ConnectedCalendar updateCalendar(Long id, ConnectedCalendar calendar) {
        return repository.findById(id).map(existing -> {
            if (calendar.getAccountName() != null) existing.setAccountName(calendar.getAccountName());
            if (calendar.getEmailAddress() != null) existing.setEmailAddress(calendar.getEmailAddress());
            if (calendar.getCalendarType() != null) existing.setCalendarType(calendar.getCalendarType());
            if (calendar.getSyncUrl() != null) existing.setSyncUrl(iCalParserService.normalizeICalUrl(calendar.getSyncUrl()));
            if (calendar.getColorTag() != null) existing.setColorTag(calendar.getColorTag());
            if (calendar.getSyncEnabled() != null) existing.setSyncEnabled(calendar.getSyncEnabled());
            existing.setLastSyncedAt(LocalDateTime.now());
            return repository.save(existing);
        }).orElseGet(() -> {
            calendar.setId(id);
            if (calendar.getSyncUrl() != null) calendar.setSyncUrl(iCalParserService.normalizeICalUrl(calendar.getSyncUrl()));
            calendar.setLastSyncedAt(LocalDateTime.now());
            return repository.save(calendar);
        });
    }

    @org.springframework.transaction.annotation.Transactional
    public List<ConnectedCalendar> batchSaveCalendars(List<ConnectedCalendar> draftList) {
        if (draftList == null) draftList = new ArrayList<>();

        List<ConnectedCalendar> existingCalendars = repository.findAll();
        Set<Long> keepIds = new HashSet<>();
        List<ConnectedCalendar> savedResult = new ArrayList<>();

        for (ConnectedCalendar draft : draftList) {
            if (draft.getId() != null && draft.getId() < 1000000000000L) {
                Optional<ConnectedCalendar> existingOpt = repository.findById(draft.getId());
                if (existingOpt.isPresent()) {
                    ConnectedCalendar existing = existingOpt.get();
                    if (draft.getAccountName() != null) existing.setAccountName(draft.getAccountName());
                    if (draft.getEmailAddress() != null) existing.setEmailAddress(draft.getEmailAddress());
                    if (draft.getCalendarType() != null) existing.setCalendarType(draft.getCalendarType());
                    if (draft.getSyncUrl() != null) existing.setSyncUrl(iCalParserService.normalizeICalUrl(draft.getSyncUrl()));
                    if (draft.getColorTag() != null) existing.setColorTag(draft.getColorTag());
                    if (draft.getSyncEnabled() != null) existing.setSyncEnabled(draft.getSyncEnabled());
                    existing.setLastSyncedAt(LocalDateTime.now());
                    ConnectedCalendar saved = repository.save(existing);
                    keepIds.add(saved.getId());
                    savedResult.add(saved);
                    continue;
                }
            }

            ConnectedCalendar newCal = new ConnectedCalendar();
            newCal.setAccountName(draft.getAccountName() != null ? draft.getAccountName() : "Lịch mới");
            newCal.setEmailAddress(draft.getEmailAddress() != null ? draft.getEmailAddress() : "");
            newCal.setCalendarType(draft.getCalendarType() != null ? draft.getCalendarType() : "ICAL");
            newCal.setSyncUrl(draft.getSyncUrl() != null ? iCalParserService.normalizeICalUrl(draft.getSyncUrl()) : "");
            newCal.setColorTag(draft.getColorTag() != null && !draft.getColorTag().isBlank() ? draft.getColorTag() : "#3b82f6");
            newCal.setSyncEnabled(draft.getSyncEnabled() != null ? draft.getSyncEnabled() : true);
            newCal.setCreatedAt(LocalDateTime.now());
            newCal.setLastSyncedAt(LocalDateTime.now());
            ConnectedCalendar saved = repository.save(newCal);
            keepIds.add(saved.getId());
            savedResult.add(saved);
        }

        for (ConnectedCalendar existing : existingCalendars) {
            if (!keepIds.contains(existing.getId())) {
                repository.deleteById(existing.getId());
            }
        }

        iCalParserService.clearCache();
        return savedResult;
    }

    public void deleteCalendar(Long id) {
        repository.deleteById(id);
    }

    public Map<String, Object> syncAndDetectConflicts() {
        iCalParserService.clearCache();
        List<ConnectedCalendar> activeCalendars = repository.findBySyncEnabledTrue();
        List<CalendarEvent> allEvents = new ArrayList<>();

        for (ConnectedCalendar cal : activeCalendars) {
            if (cal.getSyncUrl() != null && !cal.getSyncUrl().isBlank()) {
                String normalized = iCalParserService.normalizeICalUrl(cal.getSyncUrl());
                if (!normalized.equals(cal.getSyncUrl())) {
                    cal.setSyncUrl(normalized);
                }
            }
            cal.setLastSyncedAt(LocalDateTime.now());
            repository.save(cal);

            if (cal.getSyncUrl() != null && !cal.getSyncUrl().isBlank()) {
                List<CalendarEvent> parsed = iCalParserService.fetchAndParseICal(cal.getSyncUrl(), cal.getAccountName(), cal.getEmailAddress());
                allEvents.addAll(parsed);
            }
        }

        List<Map<String, Object>> conflicts = new ArrayList<>();
        DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("HH:mm");
        DateTimeFormatter dateTimeFormatter = DateTimeFormatter.ofPattern("dd/MM HH:mm");

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

                    String formattedSlot;
                    if (startOverlap.toLocalDate().equals(endOverlap.toLocalDate())) {
                        formattedSlot = startOverlap.format(timeFormatter) + " - " + endOverlap.format(timeFormatter);
                    } else {
                        formattedSlot = startOverlap.format(dateTimeFormatter) + " - " + endOverlap.format(dateTimeFormatter);
                    }

                    conflict.put("timeSlot", formattedSlot);
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
