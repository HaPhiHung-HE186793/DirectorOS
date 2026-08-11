package com.myhung.mytask.plan.dto;

import com.myhung.mytask.task.dto.TaskResponse;
import java.time.LocalDate;
import java.util.List;
import lombok.Builder;

@Builder
public record GeneratedPlanResponse(LocalDate date, List<TaskResponse> candidateTasks) {
}
