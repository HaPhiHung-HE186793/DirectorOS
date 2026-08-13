package com.myhung.mytask.calendar.repository;

import com.myhung.mytask.calendar.entity.ConnectedCalendar;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ConnectedCalendarRepository extends JpaRepository<ConnectedCalendar, Long> {
    List<ConnectedCalendar> findBySyncEnabledTrue();
}
