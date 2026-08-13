package com.myhung.mytask.task.dto;

import jakarta.validation.constraints.Min;

public class PomodoroLogRequest {

    @Min(1)
    private Integer minutesSpent = 25;

    private Boolean autoUpdateStatus = true;

    public PomodoroLogRequest() {}

    public PomodoroLogRequest(Integer minutesSpent, Boolean autoUpdateStatus) {
        this.minutesSpent = minutesSpent;
        this.autoUpdateStatus = autoUpdateStatus;
    }

    public Integer getMinutesSpent() {
        return minutesSpent != null ? minutesSpent : 25;
    }

    public void setMinutesSpent(Integer minutesSpent) {
        this.minutesSpent = minutesSpent;
    }

    public Boolean getAutoUpdateStatus() {
        return autoUpdateStatus != null ? autoUpdateStatus : true;
    }

    public void setAutoUpdateStatus(Boolean autoUpdateStatus) {
        this.autoUpdateStatus = autoUpdateStatus;
    }
}
