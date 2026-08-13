package com.myhung.mytask.task.dto;

import com.myhung.mytask.task.entity.TaskPriority;
import com.myhung.mytask.task.entity.TaskSource;
import com.myhung.mytask.task.entity.TaskStatus;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

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
        Integer actualMinutes,
        Integer completedPomodoros,
        Integer progressPercentage,
        List<TaskSubItemDto> subItems,
        Set<String> tags) {

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long id;
        private String title;
        private String description;
        private TaskStatus status;
        private TaskPriority priority;
        private TaskSource source;
        private String assignedBy;
        private LocalDateTime createdAt;
        private LocalDate dueDate;
        private LocalDateTime startedAt;
        private LocalDateTime completedAt;
        private Integer estimatedMinutes;
        private Integer actualMinutes;
        private Integer completedPomodoros;
        private Integer progressPercentage;
        private List<TaskSubItemDto> subItems;
        private Set<String> tags;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder title(String title) { this.title = title; return this; }
        public Builder description(String description) { this.description = description; return this; }
        public Builder status(TaskStatus status) { this.status = status; return this; }
        public Builder priority(TaskPriority priority) { this.priority = priority; return this; }
        public Builder source(TaskSource source) { this.source = source; return this; }
        public Builder assignedBy(String assignedBy) { this.assignedBy = assignedBy; return this; }
        public Builder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public Builder dueDate(LocalDate dueDate) { this.dueDate = dueDate; return this; }
        public Builder startedAt(LocalDateTime startedAt) { this.startedAt = startedAt; return this; }
        public Builder completedAt(LocalDateTime completedAt) { this.completedAt = completedAt; return this; }
        public Builder estimatedMinutes(Integer estimatedMinutes) { this.estimatedMinutes = estimatedMinutes; return this; }
        public Builder actualMinutes(Integer actualMinutes) { this.actualMinutes = actualMinutes; return this; }
        public Builder completedPomodoros(Integer completedPomodoros) { this.completedPomodoros = completedPomodoros; return this; }
        public Builder progressPercentage(Integer progressPercentage) { this.progressPercentage = progressPercentage; return this; }
        public Builder subItems(List<TaskSubItemDto> subItems) { this.subItems = subItems; return this; }
        public Builder tags(Set<String> tags) { this.tags = tags; return this; }

        public TaskResponse build() {
            return new TaskResponse(id, title, description, status, priority, source, assignedBy, createdAt, dueDate, startedAt, completedAt, estimatedMinutes, actualMinutes, completedPomodoros, progressPercentage, subItems, tags);
        }
    }
}
