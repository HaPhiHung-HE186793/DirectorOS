package com.myhung.mytask.calendar.repository;

import com.myhung.mytask.calendar.entity.SpecialDate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface SpecialDateRepository extends JpaRepository<SpecialDate, Long> {

    List<SpecialDate> findByEventDate(LocalDate date);

    List<SpecialDate> findByEventDateBetween(LocalDate start, LocalDate end);

    List<SpecialDate> findByEventType(String eventType);

    List<SpecialDate> findByRecurringYearlyTrue();

    /**
     * Find all special dates that occur in a given month,
     * including recurring yearly events (matching month and day regardless of year).
     */
    @Query("SELECT s FROM SpecialDate s WHERE " +
           "(s.eventDate BETWEEN :startDate AND :endDate) OR " +
           "(s.recurringYearly = true AND EXTRACT(MONTH FROM s.eventDate) = :month AND EXTRACT(DAY FROM s.eventDate) BETWEEN 1 AND 31)")
    List<SpecialDate> findEventsForMonth(
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate,
            @Param("month") int month);
}
