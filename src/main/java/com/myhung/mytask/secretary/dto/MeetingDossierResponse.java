package com.myhung.mytask.secretary.dto;

import java.util.List;

public record MeetingDossierResponse(
        Long taskId,
        String meetingTitle,
        String scheduledTime,
        String primaryObjective,
        List<String> keyAttendees,
        List<String> strategicQuestions,
        List<String> keyContextPoints,
        String recommendedOutcome
) {}
