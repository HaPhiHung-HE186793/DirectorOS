package com.myhung.mytask.plan.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class PlanItemRequest {

    @NotNull
    private Long taskId;

    @NotNull
    @Min(0)
    private Integer orderIndex;

    @Min(1)
    private Integer plannedMinutes;

    private boolean done;
}
