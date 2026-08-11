package com.myhung.mytask.plan.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

public class DailyPlanRequest {

    @NotNull
    private LocalDate planDate;

    private String note;

    @Valid
    private List<PlanItemRequest> items = new ArrayList<>();

    public DailyPlanRequest() {}

    public DailyPlanRequest(LocalDate planDate, String note, List<PlanItemRequest> items) {
        this.planDate = planDate;
        this.note = note;
        if (items != null) this.items = items;
    }

    public LocalDate getPlanDate() { return planDate; }
    public void setPlanDate(LocalDate planDate) { this.planDate = planDate; }

    public String getNote() { return note; }
    public void setNote(String note) { this.note = note; }

    public List<PlanItemRequest> getItems() { return items; }
    public void setItems(List<PlanItemRequest> items) { this.items = items; }

    public static DailyPlanRequestBuilder builder() {
        return new DailyPlanRequestBuilder();
    }

    public static class DailyPlanRequestBuilder {
        private LocalDate planDate;
        private String note;
        private List<PlanItemRequest> items = new ArrayList<>();

        public DailyPlanRequestBuilder planDate(LocalDate planDate) { this.planDate = planDate; return this; }
        public DailyPlanRequestBuilder note(String note) { this.note = note; return this; }
        public DailyPlanRequestBuilder items(List<PlanItemRequest> items) { this.items = items; return this; }

        public DailyPlanRequest build() {
            return new DailyPlanRequest(planDate, note, items);
        }
    }
}
