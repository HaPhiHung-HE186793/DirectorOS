package com.myhung.mytask.task.dto;

import com.myhung.mytask.task.entity.TaskPriority;
import com.myhung.mytask.task.entity.TaskSource;
import com.myhung.mytask.task.entity.TaskStatus;
import java.time.LocalDate;
import lombok.Builder;

@Builder
public record TaskFilterRequest(
        TaskStatus status,
        TaskPriority priority,
        TaskSource source,
        LocalDate dueDateFrom,
        LocalDate dueDateTo) {
}
