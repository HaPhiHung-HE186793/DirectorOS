package com.myhung.mytask.analytics.dto;

import java.util.List;

public record AnalyticsSummaryResponse(
        long totalTasks,
        long completedTasks,
        long pendingTasks,
        double completionRate,
        long bossTasksTotal,
        long bossTasksCompleted,
        double bossCompletionRate,
        long totalEstimatedMinutes,
        long overdueTasksCount,
        List<DailyStatsResponse> weeklyStats) {

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private long totalTasks;
        private long completedTasks;
        private long pendingTasks;
        private double completionRate;
        private long bossTasksTotal;
        private long bossTasksCompleted;
        private double bossCompletionRate;
        private long totalEstimatedMinutes;
        private long overdueTasksCount;
        private List<DailyStatsResponse> weeklyStats;

        public Builder totalTasks(long totalTasks) { this.totalTasks = totalTasks; return this; }
        public Builder completedTasks(long completedTasks) { this.completedTasks = completedTasks; return this; }
        public Builder pendingTasks(long pendingTasks) { this.pendingTasks = pendingTasks; return this; }
        public Builder completionRate(double completionRate) { this.completionRate = completionRate; return this; }
        public Builder bossTasksTotal(long bossTasksTotal) { this.bossTasksTotal = bossTasksTotal; return this; }
        public Builder bossTasksCompleted(long bossTasksCompleted) { this.bossTasksCompleted = bossTasksCompleted; return this; }
        public Builder bossCompletionRate(double bossCompletionRate) { this.bossCompletionRate = bossCompletionRate; return this; }
        public Builder totalEstimatedMinutes(long totalEstimatedMinutes) { this.totalEstimatedMinutes = totalEstimatedMinutes; return this; }
        public Builder overdueTasksCount(long overdueTasksCount) { this.overdueTasksCount = overdueTasksCount; return this; }
        public Builder weeklyStats(List<DailyStatsResponse> weeklyStats) { this.weeklyStats = weeklyStats; return this; }

        public AnalyticsSummaryResponse build() {
            return new AnalyticsSummaryResponse(totalTasks, completedTasks, pendingTasks, completionRate,
                    bossTasksTotal, bossTasksCompleted, bossCompletionRate, totalEstimatedMinutes,
                    overdueTasksCount, weeklyStats);
        }
    }
}
