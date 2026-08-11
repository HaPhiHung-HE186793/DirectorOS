package com.myhung.mytask.plan.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public record DailyPlanResponse(
        Long id,
        LocalDate planDate,
        LocalDateTime createdAt,
        String note,
        List<PlanItemResponse> items) {

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long id;
        private LocalDate planDate;
        private LocalDateTime createdAt;
        private String note;
        private List<PlanItemResponse> items;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder planDate(LocalDate planDate) { this.planDate = planDate; return this; }
        public Builder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public Builder note(String note) { this.note = note; return this; }
        public Builder items(List<PlanItemResponse> items) { this.items = items; return this; }

        public DailyPlanResponse build() {
            return new DailyPlanResponse(id, planDate, createdAt, note, items);
        }
    }
}
