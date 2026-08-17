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
