package com.myhung.mytask.plan.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

import com.myhung.mytask.plan.dto.GeneratedPlanResponse;
import com.myhung.mytask.plan.repository.DailyPlanRepository;
import com.myhung.mytask.task.dto.TaskResponse;
import com.myhung.mytask.task.repository.TaskRepository;
import com.myhung.mytask.task.service.TaskService;
import java.time.LocalDate;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class PlanServiceTest {

    @Mock
    private DailyPlanRepository dailyPlanRepository;

    @Mock
    private TaskRepository taskRepository;

    @Mock
    private TaskService taskService;

    @InjectMocks
    private PlanService planService;

    @Test
    void generateShouldReturnCandidateTasksFromTaskService() {
        LocalDate date = LocalDate.of(2026, 8, 11);
        TaskResponse task = TaskResponse.builder()
                .id(1L)
                .title("Overdue bug")
                .build();
        when(taskService.getOverdueAndHighPriorityTasks()).thenReturn(List.of(task));

        GeneratedPlanResponse response = planService.generate(date);

        assertThat(response.date()).isEqualTo(date);
        assertThat(response.candidateTasks()).containsExactly(task);
    }
}
