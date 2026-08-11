package com.myhung.mytask.plan.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import lombok.Builder;

@Builder
public record DailyPlanResponse(
        Long id,
        LocalDate planDate,
        LocalDateTime createdAt,
        String note,
        List<PlanItemResponse> items) {
}
