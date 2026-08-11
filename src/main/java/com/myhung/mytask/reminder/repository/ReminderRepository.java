package com.myhung.mytask.reminder.repository;

import com.myhung.mytask.reminder.entity.Reminder;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReminderRepository extends JpaRepository<Reminder, Long> {
}
