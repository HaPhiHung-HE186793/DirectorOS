package com.myhung.mytask.calendar.service;

import com.myhung.mytask.calendar.entity.SpecialDate;
import com.myhung.mytask.calendar.repository.SpecialDateRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class SpecialDateService {

    private static final Logger log = LoggerFactory.getLogger(SpecialDateService.class);
    private final SpecialDateRepository repository;

    public SpecialDateService(SpecialDateRepository repository) {
        this.repository = repository;
    }

    @jakarta.annotation.PostConstruct
    public void seedAugustSpecialDatesIfMissing() {
        try {
            List<SpecialDate> all = repository.findAll();
            boolean hasAugust = all.stream().anyMatch(sd -> sd.getEventDate() != null && sd.getEventDate().getMonthValue() == 8);
            if (!hasAugust) {
                log.info("Seeding August special dates into database...");
                SpecialDate cm8 = new SpecialDate();
                cm8.setTitle("Cách mạng Tháng Tám");
                cm8.setEventDate(LocalDate.of(2026, 8, 19));
                cm8.setEventType("HOLIDAY");
                cm8.setRecurringYearly(true);
                cm8.setColor("#ef4444");
                cm8.setIcon("🇻🇳");
                cm8.setNote("Kỷ niệm Ngày Cách mạng Tháng Tám thành công (19/08)");
                cm8.setCreatedAt(LocalDateTime.now());
                repository.save(cm8);

                SpecialDate cand = new SpecialDate();
                cand.setTitle("Ngày Công an Nhân dân");
                cand.setEventDate(LocalDate.of(2026, 8, 19));
                cand.setEventType("ANNIVERSARY");
                cand.setRecurringYearly(true);
                cand.setColor("#3b82f6");
                cand.setIcon("🛡️");
                cand.setNote("Ngày truyền thống Công an Nhân dân Việt Nam");
                cand.setCreatedAt(LocalDateTime.now());
                repository.save(cand);

                SpecialDate vuLan = new SpecialDate();
                vuLan.setTitle("Lễ Vu Lan (Rằm Tháng 7)");
                vuLan.setEventDate(LocalDate.of(2026, 8, 27));
                vuLan.setEventType("HOLIDAY");
                vuLan.setRecurringYearly(true);
                vuLan.setColor("#ec4899");
                vuLan.setIcon("🪷");
                vuLan.setNote("Rằm tháng 7 - Ngày Báo Hiếu Âm lịch");
                vuLan.setCreatedAt(LocalDateTime.now());
                repository.save(vuLan);
            }
        } catch (Exception e) {
            log.warn("Could not auto-seed August special dates: {}", e.getMessage());
        }
    }

    public List<SpecialDate> getAll() {
        return repository.findAll();
    }

    public SpecialDate getById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Special date not found with id " + id));
    }

    @Transactional
    public SpecialDate create(SpecialDate specialDate) {
        if (specialDate.getCreatedAt() == null) {
            specialDate.setCreatedAt(LocalDateTime.now());
        }
        if (specialDate.getColor() == null || specialDate.getColor().isBlank()) {
            specialDate.setColor(getDefaultColor(specialDate.getEventType()));
        }
        if (specialDate.getRecurringYearly() == null) {
            specialDate.setRecurringYearly(true);
        }
        return repository.save(specialDate);
    }

    @Transactional
    public SpecialDate update(Long id, SpecialDate updated) {
        SpecialDate existing = getById(id);
        existing.setTitle(updated.getTitle());
        existing.setEventDate(updated.getEventDate());
        existing.setLunarDay(updated.getLunarDay());
        existing.setLunarMonth(updated.getLunarMonth());
        existing.setIsLunarBased(updated.getIsLunarBased());
        existing.setEventType(updated.getEventType());
        existing.setRecurringYearly(updated.getRecurringYearly());
        existing.setColor(updated.getColor());
        existing.setIcon(updated.getIcon());
        existing.setNote(updated.getNote());
        return repository.save(existing);
    }

    @Transactional
    public void delete(Long id) {
        repository.deleteById(id);
    }

    /**
     * Get all special dates relevant for a given month.
     * Includes both exact-date matches and recurring yearly events.
     */
    public List<SpecialDate> getEventsForMonth(int year, int month) {
        LocalDate startDate = LocalDate.of(year, month, 1);
        LocalDate endDate = startDate.withDayOfMonth(startDate.lengthOfMonth());

        // Get direct matches for this month
        List<SpecialDate> directMatches = repository.findByEventDateBetween(startDate, endDate);

        // Get recurring yearly events that fall in this month (from any year)
        List<SpecialDate> recurringEvents = repository.findByRecurringYearlyTrue();

        List<SpecialDate> result = new ArrayList<>(directMatches);

        for (SpecialDate recurring : recurringEvents) {
            // Check if this recurring event's month/day falls in the requested month
            if (recurring.getEventDate().getMonthValue() == month) {
                // Avoid duplicates (already in directMatches if same year)
                boolean alreadyIncluded = directMatches.stream()
                        .anyMatch(d -> d.getId().equals(recurring.getId()));
                if (!alreadyIncluded) {
                    result.add(recurring);
                }
            }
        }

        log.debug("Found {} special dates for {}/{}", result.size(), year, month);
        return result;
    }

    public List<SpecialDate> getByEventType(String eventType) {
        return repository.findByEventType(eventType);
    }

    private String getDefaultColor(String eventType) {
        if (eventType == null) return "#f59e0b";
        return switch (eventType.toUpperCase()) {
            case "BIRTHDAY" -> "#ec4899";
            case "HOLIDAY" -> "#ef4444";
            case "ANNIVERSARY" -> "#8b5cf6";
            case "CUSTOM" -> "#3b82f6";
            default -> "#f59e0b";
        };
    }
}
