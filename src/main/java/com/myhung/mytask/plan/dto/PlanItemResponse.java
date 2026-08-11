package com.myhung.mytask.plan.dto;

import lombok.Builder;

@Builder
public record PlanItemResponse(
        Long id,
        Long taskId,
        String taskTitle,
        Integer orderIndex,
        Integer plannedMinutes,
        boolean done) {
}
