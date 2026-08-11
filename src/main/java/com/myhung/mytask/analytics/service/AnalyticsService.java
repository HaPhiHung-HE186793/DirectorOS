package com.myhung.mytask.analytics.service;

import com.myhung.mytask.analytics.dto.AnalyticsSummaryResponse;
import com.myhung.mytask.analytics.dto.DailyStatsResponse;
import com.myhung.mytask.task.entity.Task;
import com.myhung.mytask.task.entity.TaskSource;
import com.myhung.mytask.task.entity.TaskStatus;
import com.myhung.mytask.task.repository.TaskRepository;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AnalyticsService {

    private final TaskRepository taskRepository;

    public AnalyticsService(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    @Transactional(readOnly = true)
    public AnalyticsSummaryResponse getSummary() {
        List<Task> allTasks = taskRepository.findAll();
        LocalDate today = LocalDate.now();

        long totalTasks = allTasks.size();
        long completedTasks = allTasks.stream().filter(t -> t.getStatus() == TaskStatus.DONE).count();
        long pendingTasks = totalTasks - completedTasks;
        double completionRate = totalTasks > 0 ? Math.round(((double) completedTasks / totalTasks * 100) * 10.0) / 10.0 : 0.0;

        long bossTasksTotal = allTasks.stream().filter(t -> t.getSource() == TaskSource.BOSS).count();
        long bossTasksCompleted = allTasks.stream().filter(t -> t.getSource() == TaskSource.BOSS && t.getStatus() == TaskStatus.DONE).count();
        double bossCompletionRate = bossTasksTotal > 0 ? Math.round(((double) bossTasksCompleted / bossTasksTotal * 100) * 10.0) / 10.0 : 0.0;

        long totalEstimatedMinutes = allTasks.stream()
                .mapToInt(t -> t.getEstimatedMinutes() != null ? t.getEstimatedMinutes() : 0)
                .sum();

        long overdueTasksCount = allTasks.stream()
                .filter(t -> t.getStatus() != TaskStatus.DONE && t.getDueDate() != null && t.getDueDate().isBefore(today))
                .count();

        // 7 days weekly stats (from 6 days ago to today)
        List<DailyStatsResponse> weeklyStats = new ArrayList<>();
        for (int i = 6; i >= 0; i--) {
            LocalDate date = today.minusDays(i);
            long created = allTasks.stream()
                    .filter(t -> t.getCreatedAt() != null && t.getCreatedAt().toLocalDate().equals(date))
                    .count();
            long completed = allTasks.stream()
                    .filter(t -> t.getCompletedAt() != null && t.getCompletedAt().toLocalDate().equals(date))
                    .count();
            weeklyStats.add(DailyStatsResponse.builder()
                    .date(date)
                    .createdCount((int) created)
                    .completedCount((int) completed)
                    .build());
        }

        return AnalyticsSummaryResponse.builder()
                .totalTasks(totalTasks)
                .completedTasks(completedTasks)
                .pendingTasks(pendingTasks)
                .completionRate(completionRate)
                .bossTasksTotal(bossTasksTotal)
                .bossTasksCompleted(bossTasksCompleted)
                .bossCompletionRate(bossCompletionRate)
                .totalEstimatedMinutes(totalEstimatedMinutes)
                .overdueTasksCount(overdueTasksCount)
                .weeklyStats(weeklyStats)
                .build();
    }
}
