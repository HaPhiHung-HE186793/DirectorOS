package com.myhung.mytask.plan.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import lombok.Data;

@Data
public class DailyPlanRequest {

    @NotNull
    private LocalDate planDate;

    private String note;

    @Valid
    private List<PlanItemRequest> items = new ArrayList<>();
}
