package com.myhung.mytask.plan.service;

import com.myhung.mytask.common.ResourceNotFoundException;
import com.myhung.mytask.plan.dto.DailyPlanRequest;
import com.myhung.mytask.plan.dto.DailyPlanResponse;
import com.myhung.mytask.plan.dto.GeneratedPlanResponse;
import com.myhung.mytask.plan.dto.PlanItemRequest;
import com.myhung.mytask.plan.dto.PlanItemResponse;
import com.myhung.mytask.plan.entity.DailyPlan;
import com.myhung.mytask.plan.entity.PlanItem;
import com.myhung.mytask.plan.repository.DailyPlanRepository;
import com.myhung.mytask.task.entity.Task;
import com.myhung.mytask.task.repository.TaskRepository;
import com.myhung.mytask.task.service.TaskService;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.Objects;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PlanService {

    private final DailyPlanRepository dailyPlanRepository;
    private final TaskRepository taskRepository;
    private final TaskService taskService;

    public PlanService(DailyPlanRepository dailyPlanRepository, TaskRepository taskRepository, TaskService taskService) {
        this.dailyPlanRepository = dailyPlanRepository;
        this.taskRepository = taskRepository;
        this.taskService = taskService;
    }

    @Transactional
    public DailyPlanResponse create(DailyPlanRequest request) {
        dailyPlanRepository.findByPlanDate(request.getPlanDate()).ifPresent(existing -> {
            throw new IllegalArgumentException("Plan already exists for date " + request.getPlanDate());
        });

        DailyPlan plan = new DailyPlan();
        plan.setPlanDate(request.getPlanDate());
        plan.setNote(request.getNote());
        plan.setCreatedAt(LocalDateTime.now());
        setPlanItems(plan, safeItems(request.getItems()));
        return toResponse(dailyPlanRepository.save(plan));
    }

    @Transactional
    public DailyPlanResponse update(Long id, DailyPlanRequest request) {
        DailyPlan plan = findPlanOrThrow(id);
        if (!plan.getPlanDate().equals(request.getPlanDate())) {
            dailyPlanRepository.findByPlanDate(request.getPlanDate()).ifPresent(existing -> {
                if (!existing.getId().equals(id)) {
                    throw new IllegalArgumentException("Plan already exists for date " + request.getPlanDate());
                }
            });
        }

        plan.setPlanDate(request.getPlanDate());
        plan.setNote(request.getNote());
        setPlanItems(plan, safeItems(request.getItems()));
        return toResponse(dailyPlanRepository.save(plan));
    }

    @Transactional(readOnly = true)
    public DailyPlanResponse getById(Long id) {
        return toResponse(findPlanOrThrow(id));
    }

    @Transactional(readOnly = true)
    public List<DailyPlanResponse> getAll() {
        return dailyPlanRepository.findAll().stream()
                .sorted(Comparator.comparing(DailyPlan::getPlanDate).reversed())
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public void delete(Long id) {
        DailyPlan plan = findPlanOrThrow(id);
        dailyPlanRepository.delete(plan);
    }

    @Transactional(readOnly = true)
    public DailyPlanResponse getToday() {
        DailyPlan plan = dailyPlanRepository.findByPlanDate(LocalDate.now())
                .orElseThrow(() -> new ResourceNotFoundException("No plan found for today"));
        return toResponse(plan);
    }

    @Transactional(readOnly = true)
    public GeneratedPlanResponse generate(LocalDate date) {
        return GeneratedPlanResponse.builder()
                .date(date)
                .candidateTasks(taskService.getOverdueAndHighPriorityTasks())
                .build();
    }

    private DailyPlan findPlanOrThrow(Long id) {
        return dailyPlanRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Plan with id " + id + " not found"));
    }

    private void setPlanItems(DailyPlan plan, List<PlanItemRequest> itemRequests) {
        plan.getItems().clear();
        for (PlanItemRequest itemRequest : itemRequests) {
            Task task = taskRepository.findById(itemRequest.getTaskId())
                    .orElseThrow(() -> new ResourceNotFoundException("Task with id " + itemRequest.getTaskId() + " not found"));
            PlanItem item = new PlanItem();
            item.setPlan(plan);
            item.setTask(task);
            item.setOrderIndex(itemRequest.getOrderIndex());
            item.setPlannedMinutes(itemRequest.getPlannedMinutes());
            item.setDone(itemRequest.isDone());
            plan.getItems().add(item);
        }
    }

    private List<PlanItemRequest> safeItems(List<PlanItemRequest> items) {
        return Objects.requireNonNullElse(items, List.of());
    }

    private DailyPlanResponse toResponse(DailyPlan plan) {
        List<PlanItemResponse> items = plan.getItems().stream()
                .sorted(Comparator.comparing(PlanItem::getOrderIndex))
                .<PlanItemResponse>map(item -> PlanItemResponse.builder()
                        .id(item.getId())
                        .taskId(item.getTask().getId())
                        .taskTitle(item.getTask().getTitle())
                        .orderIndex(item.getOrderIndex())
                        .plannedMinutes(item.getPlannedMinutes())
                        .done(item.isDone())
                        .build())
                .toList();

        return DailyPlanResponse.builder()
                .id(plan.getId())
                .planDate(plan.getPlanDate())
                .createdAt(plan.getCreatedAt())
                .note(plan.getNote())
                .items(items)
                .build();
    }
}
