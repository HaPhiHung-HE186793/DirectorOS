package com.myhung.mytask.plan.dto;

import com.myhung.mytask.task.dto.TaskResponse;
import java.time.LocalDate;
import java.util.List;

public record GeneratedPlanResponse(LocalDate date, List<TaskResponse> candidateTasks) {

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private LocalDate date;
        private List<TaskResponse> candidateTasks;

        public Builder date(LocalDate date) { this.date = date; return this; }
        public Builder candidateTasks(List<TaskResponse> candidateTasks) { this.candidateTasks = candidateTasks; return this; }

        public GeneratedPlanResponse build() {
            return new GeneratedPlanResponse(date, candidateTasks);
        }
    }
}
