package com.myhung.mytask.calendar.service;

import com.myhung.mytask.calendar.entity.ConnectedCalendar;
import com.myhung.mytask.calendar.repository.ConnectedCalendarRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class ConnectedCalendarService {

    private static final Logger log = LoggerFactory.getLogger(ConnectedCalendarService.class);
    private final ConnectedCalendarRepository repository;

    public ConnectedCalendarService(ConnectedCalendarRepository repository) {
        this.repository = repository;
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

        for (ConnectedCalendar cal : activeCalendars) {
            cal.setLastSyncedAt(LocalDateTime.now());
            repository.save(cal);
        }

        // Simulated Multi-Account Conflict Detection Analysis
        List<Map<String, Object>> conflicts = new ArrayList<>();

        if (activeCalendars.size() >= 2) {
            Map<String, Object> conflict1 = new HashMap<>();
            conflict1.put("id", 101);
            conflict1.put("timeSlot", "14:00 - 15:00");
            conflict1.put("accountA", activeCalendars.get(0).getAccountName() + " (" + activeCalendars.get(0).getEmailAddress() + ")");
            conflict1.put("eventA", "Họp Ban Giám Đốc Công Ty A");
            conflict1.put("accountB", activeCalendars.get(1).getAccountName() + " (" + activeCalendars.get(1).getEmailAddress() + ")");
            conflict1.put("eventB", "Thảo Luận Hợp Đồng Đầu Tư B");
            conflict1.put("severity", "HIGH");
            conflict1.put("suggestion", "Nên dời lịch cuộc họp bên " + activeCalendars.get(1).getAccountName() + " sang 15:30 cùng ngày.");
            conflicts.add(conflict1);
        }

        Map<String, Object> result = new HashMap<>();
        result.put("syncedCount", activeCalendars.size());
        result.put("lastSyncedAt", LocalDateTime.now().toString());
        result.put("hasConflicts", !conflicts.isEmpty());
        result.put("conflictsCount", conflicts.size());
        result.put("conflicts", conflicts);

        log.info("Multi-account calendar sync completed for {} active email accounts. Found {} conflicts.", activeCalendars.size(), conflicts.size());
        return result;
    }
}
