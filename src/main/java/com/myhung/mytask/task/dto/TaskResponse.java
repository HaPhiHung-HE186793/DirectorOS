package com.myhung.mytask.task.dto;

import com.myhung.mytask.task.entity.TaskPriority;
import com.myhung.mytask.task.entity.TaskSource;
import com.myhung.mytask.task.entity.TaskStatus;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Set;
import lombok.Builder;

@Builder
public record TaskResponse(
        Long id,
        String title,
        String description,
        TaskStatus status,
        TaskPriority priority,
        TaskSource source,
        String assignedBy,
        LocalDateTime createdAt,
        LocalDate dueDate,
        LocalDateTime startedAt,
        LocalDateTime completedAt,
        Integer estimatedMinutes,
        Set<String> tags) {
}
