package com.myhung.mytask.plan.dto;

public record PlanItemResponse(
        Long id,
        Long taskId,
        String taskTitle,
        Integer orderIndex,
        Integer plannedMinutes,
        boolean done) {

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long id;
        private Long taskId;
        private String taskTitle;
        private Integer orderIndex;
        private Integer plannedMinutes;
        private boolean done;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder taskId(Long taskId) { this.taskId = taskId; return this; }
        public Builder taskTitle(String taskTitle) { this.taskTitle = taskTitle; return this; }
        public Builder orderIndex(Integer orderIndex) { this.orderIndex = orderIndex; return this; }
        public Builder plannedMinutes(Integer plannedMinutes) { this.plannedMinutes = plannedMinutes; return this; }
        public Builder done(boolean done) { this.done = done; return this; }

        public PlanItemResponse build() {
            return new PlanItemResponse(id, taskId, taskTitle, orderIndex, plannedMinutes, done);
        }
    }
}
