package com.myhung.mytask.secretary.dto;

import com.myhung.mytask.task.dto.TaskResponse;
import java.time.LocalDate;
import java.util.List;

public record ExecutiveBriefingResponse(
        LocalDate date,
        String greeting,
        String summaryText,
        int totalTasksCount,
        int directorDecisionsCount,
        int meetingsCount,
        int urgentCount,
        int overdueCount,
        int decisionLoadIndex,
        String decisionLoadWarning,
        List<TaskResponse> decisionTasks,
        List<TaskResponse> meetingTasks,
        List<TaskResponse> urgentTasks,
        List<TaskResponse> delegatedTasks,
        List<String> secretaryAdvice
) {
    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private LocalDate date;
        private String greeting;
        private String summaryText;
        private int totalTasksCount;
        private int directorDecisionsCount;
        private int meetingsCount;
        private int urgentCount;
        private int overdueCount;
        private int decisionLoadIndex;
        private String decisionLoadWarning;
        private List<TaskResponse> decisionTasks;
        private List<TaskResponse> meetingTasks;
        private List<TaskResponse> urgentTasks;
        private List<TaskResponse> delegatedTasks;
        private List<String> secretaryAdvice;

        public Builder date(LocalDate date) { this.date = date; return this; }
        public Builder greeting(String greeting) { this.greeting = greeting; return this; }
        public Builder summaryText(String summaryText) { this.summaryText = summaryText; return this; }
        public Builder totalTasksCount(int totalTasksCount) { this.totalTasksCount = totalTasksCount; return this; }
        public Builder directorDecisionsCount(int directorDecisionsCount) { this.directorDecisionsCount = directorDecisionsCount; return this; }
        public Builder meetingsCount(int meetingsCount) { this.meetingsCount = meetingsCount; return this; }
        public Builder urgentCount(int urgentCount) { this.urgentCount = urgentCount; return this; }
        public Builder overdueCount(int overdueCount) { this.overdueCount = overdueCount; return this; }
        public Builder decisionLoadIndex(int decisionLoadIndex) { this.decisionLoadIndex = decisionLoadIndex; return this; }
        public Builder decisionLoadWarning(String decisionLoadWarning) { this.decisionLoadWarning = decisionLoadWarning; return this; }
        public Builder decisionTasks(List<TaskResponse> decisionTasks) { this.decisionTasks = decisionTasks; return this; }
        public Builder meetingTasks(List<TaskResponse> meetingTasks) { this.meetingTasks = meetingTasks; return this; }
        public Builder urgentTasks(List<TaskResponse> urgentTasks) { this.urgentTasks = urgentTasks; return this; }
        public Builder delegatedTasks(List<TaskResponse> delegatedTasks) { this.delegatedTasks = delegatedTasks; return this; }
        public Builder secretaryAdvice(List<String> secretaryAdvice) { this.secretaryAdvice = secretaryAdvice; return this; }

        public ExecutiveBriefingResponse build() {
            return new ExecutiveBriefingResponse(
                    date, greeting, summaryText, totalTasksCount, directorDecisionsCount,
                    meetingsCount, urgentCount, overdueCount, decisionLoadIndex, decisionLoadWarning,
                    decisionTasks, meetingTasks, urgentTasks, delegatedTasks, secretaryAdvice
            );
        }
    }
}
