package com.myhung.mytask.task.dto;

import com.myhung.mytask.task.entity.TaskPriority;
import com.myhung.mytask.task.entity.TaskSource;
import com.myhung.mytask.task.entity.TaskStatus;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

public class TaskRequest {

    @NotBlank
    private String title;

    private String description;

    @NotNull
    private TaskStatus status;

    @NotNull
    private TaskPriority priority;

    @NotNull
    private TaskSource source;

    private String assignedBy;

    private LocalDate dueDate;

    private LocalDateTime startedAt;

    private LocalDateTime completedAt;

    @Min(1)
    private Integer estimatedMinutes;

    private Integer progressPercentage;

    private List<TaskSubItemDto> subItems;

    private Set<String> tags;

    public TaskRequest() {}

    public TaskRequest(String title, String description, TaskStatus status, TaskPriority priority,
                       TaskSource source, String assignedBy, LocalDate dueDate, LocalDateTime startedAt,
                       LocalDateTime completedAt, Integer estimatedMinutes, Integer progressPercentage,
                       List<TaskSubItemDto> subItems, Set<String> tags) {
        this.title = title;
        this.description = description;
        this.status = status;
        this.priority = priority;
        this.source = source;
        this.assignedBy = assignedBy;
        this.dueDate = dueDate;
        this.startedAt = startedAt;
        this.completedAt = completedAt;
        this.estimatedMinutes = estimatedMinutes;
        this.progressPercentage = progressPercentage;
        this.subItems = subItems;
        this.tags = tags;
    }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public TaskStatus getStatus() { return status; }
    public void setStatus(TaskStatus status) { this.status = status; }

    public TaskPriority getPriority() { return priority; }
    public void setPriority(TaskPriority priority) { this.priority = priority; }

    public TaskSource getSource() { return source; }
    public void setSource(TaskSource source) { this.source = source; }

    public String getAssignedBy() { return assignedBy; }
    public void setAssignedBy(String assignedBy) { this.assignedBy = assignedBy; }

    public LocalDate getDueDate() { return dueDate; }
    public void setDueDate(LocalDate dueDate) { this.dueDate = dueDate; }

    public LocalDateTime getStartedAt() { return startedAt; }
    public void setStartedAt(LocalDateTime startedAt) { this.startedAt = startedAt; }

    public LocalDateTime getCompletedAt() { return completedAt; }
    public void setCompletedAt(LocalDateTime completedAt) { this.completedAt = completedAt; }

    public Integer getEstimatedMinutes() { return estimatedMinutes; }
    public void setEstimatedMinutes(Integer estimatedMinutes) { this.estimatedMinutes = estimatedMinutes; }

    public Integer getProgressPercentage() { return progressPercentage; }
    public void setProgressPercentage(Integer progressPercentage) { this.progressPercentage = progressPercentage; }

    public List<TaskSubItemDto> getSubItems() { return subItems; }
    public void setSubItems(List<TaskSubItemDto> subItems) { this.subItems = subItems; }

    public Set<String> getTags() { return tags; }
    public void setTags(Set<String> tags) { this.tags = tags; }

    public static TaskRequestBuilder builder() {
        return new TaskRequestBuilder();
    }

    public static class TaskRequestBuilder {
        private String title;
        private String description;
        private TaskStatus status;
        private TaskPriority priority;
        private TaskSource source;
        private String assignedBy;
        private LocalDate dueDate;
        private LocalDateTime startedAt;
        private LocalDateTime completedAt;
        private Integer estimatedMinutes;
        private Integer progressPercentage;
        private List<TaskSubItemDto> subItems;
        private Set<String> tags;

        public TaskRequestBuilder title(String title) { this.title = title; return this; }
        public TaskRequestBuilder description(String description) { this.description = description; return this; }
        public TaskRequestBuilder status(TaskStatus status) { this.status = status; return this; }
        public TaskRequestBuilder priority(TaskPriority priority) { this.priority = priority; return this; }
        public TaskRequestBuilder source(TaskSource source) { this.source = source; return this; }
        public TaskRequestBuilder assignedBy(String assignedBy) { this.assignedBy = assignedBy; return this; }
        public TaskRequestBuilder dueDate(LocalDate dueDate) { this.dueDate = dueDate; return this; }
        public TaskRequestBuilder startedAt(LocalDateTime startedAt) { this.startedAt = startedAt; return this; }
        public TaskRequestBuilder completedAt(LocalDateTime completedAt) { this.completedAt = completedAt; return this; }
        public TaskRequestBuilder estimatedMinutes(Integer estimatedMinutes) { this.estimatedMinutes = estimatedMinutes; return this; }
        public TaskRequestBuilder progressPercentage(Integer progressPercentage) { this.progressPercentage = progressPercentage; return this; }
        public TaskRequestBuilder subItems(List<TaskSubItemDto> subItems) { this.subItems = subItems; return this; }
        public TaskRequestBuilder tags(Set<String> tags) { this.tags = tags; return this; }

        public TaskRequest build() {
            return new TaskRequest(title, description, status, priority, source, assignedBy, dueDate, startedAt, completedAt, estimatedMinutes, progressPercentage, subItems, tags);
        }
    }
}
