package com.myhung.mytask.task.dto;

import com.myhung.mytask.task.entity.TaskPriority;
import com.myhung.mytask.task.entity.TaskSource;
import com.myhung.mytask.task.entity.TaskStatus;
import java.time.LocalDate;

public record TaskFilterRequest(
        TaskStatus status,
        TaskPriority priority,
        TaskSource source,
        LocalDate dueDateFrom,
        LocalDate dueDateTo) {

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private TaskStatus status;
        private TaskPriority priority;
        private TaskSource source;
        private LocalDate dueDateFrom;
        private LocalDate dueDateTo;

        public Builder status(TaskStatus status) { this.status = status; return this; }
        public Builder priority(TaskPriority priority) { this.priority = priority; return this; }
        public Builder source(TaskSource source) { this.source = source; return this; }
        public Builder dueDateFrom(LocalDate dueDateFrom) { this.dueDateFrom = dueDateFrom; return this; }
        public Builder dueDateTo(LocalDate dueDateTo) { this.dueDateTo = dueDateTo; return this; }

        public TaskFilterRequest build() {
            return new TaskFilterRequest(status, priority, source, dueDateFrom, dueDateTo);
        }
    }
}
