package com.myhung.mytask.analytics.dto;

import java.time.LocalDate;

public record DailyStatsResponse(
        LocalDate date,
        int completedCount,
        int createdCount) {

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private LocalDate date;
        private int completedCount;
        private int createdCount;

        public Builder date(LocalDate date) { this.date = date; return this; }
        public Builder completedCount(int completedCount) { this.completedCount = completedCount; return this; }
        public Builder createdCount(int createdCount) { this.createdCount = createdCount; return this; }

        public DailyStatsResponse build() {
            return new DailyStatsResponse(date, completedCount, createdCount);
        }
    }
}
