package com.myhung.mytask.plan.controller;

import com.myhung.mytask.plan.dto.DailyPlanRequest;
import com.myhung.mytask.plan.dto.DailyPlanResponse;
import com.myhung.mytask.plan.dto.GeneratedPlanResponse;
import com.myhung.mytask.plan.service.PlanService;
import jakarta.validation.Valid;
import java.time.LocalDate;
import java.util.List;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/plans")
public class PlanController {

    private final PlanService planService;

    public PlanController(PlanService planService) {
        this.planService = planService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public DailyPlanResponse create(@Valid @RequestBody DailyPlanRequest request) {
        return planService.create(request);
    }

    @GetMapping("/{id}")
    public DailyPlanResponse getById(@PathVariable Long id) {
        return planService.getById(id);
    }

    @GetMapping
    public List<DailyPlanResponse> getAll() {
        return planService.getAll();
    }

    @PutMapping("/{id}")
    public DailyPlanResponse update(@PathVariable Long id, @Valid @RequestBody DailyPlanRequest request) {
        return planService.update(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        planService.delete(id);
    }

    @GetMapping("/today")
    public DailyPlanResponse getToday() {
        return planService.getToday();
    }

    @PostMapping("/generate")
    public GeneratedPlanResponse generate(@RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return planService.generate(date);
    }
}
