package com.myhung.mytask.plan.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public class PlanItemRequest {

    @NotNull
    private Long taskId;

    @NotNull
    @Min(0)
    private Integer orderIndex;

    @Min(1)
    private Integer plannedMinutes;

    private boolean done;

    public PlanItemRequest() {}

    public PlanItemRequest(Long taskId, Integer orderIndex, Integer plannedMinutes, boolean done) {
        this.taskId = taskId;
        this.orderIndex = orderIndex;
        this.plannedMinutes = plannedMinutes;
        this.done = done;
    }

    public Long getTaskId() { return taskId; }
    public void setTaskId(Long taskId) { this.taskId = taskId; }

    public Integer getOrderIndex() { return orderIndex; }
    public void setOrderIndex(Integer orderIndex) { this.orderIndex = orderIndex; }

    public Integer getPlannedMinutes() { return plannedMinutes; }
    public void setPlannedMinutes(Integer plannedMinutes) { this.plannedMinutes = plannedMinutes; }

    public boolean isDone() { return done; }
    public void setDone(boolean done) { this.done = done; }

    public static PlanItemRequestBuilder builder() {
        return new PlanItemRequestBuilder();
    }

    public static class PlanItemRequestBuilder {
        private Long taskId;
        private Integer orderIndex;
        private Integer plannedMinutes;
        private boolean done;

        public PlanItemRequestBuilder taskId(Long taskId) { this.taskId = taskId; return this; }
        public PlanItemRequestBuilder orderIndex(Integer orderIndex) { this.orderIndex = orderIndex; return this; }
        public PlanItemRequestBuilder plannedMinutes(Integer plannedMinutes) { this.plannedMinutes = plannedMinutes; return this; }
        public PlanItemRequestBuilder done(boolean done) { this.done = done; return this; }

        public PlanItemRequest build() {
            return new PlanItemRequest(taskId, orderIndex, plannedMinutes, done);
        }
    }
}
