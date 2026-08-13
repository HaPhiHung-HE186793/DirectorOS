package com.myhung.mytask.secretary.controller;

import com.myhung.mytask.secretary.dto.DirectorCommandRequest;
import com.myhung.mytask.secretary.dto.ExecutiveBriefingResponse;
import com.myhung.mytask.secretary.dto.MeetingDossierResponse;
import com.myhung.mytask.secretary.service.ExecutiveSecretaryService;
import com.myhung.mytask.task.dto.TaskResponse;
import jakarta.validation.Valid;
import java.util.Map;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/secretary")
public class ExecutiveSecretaryController {

    private final ExecutiveSecretaryService secretaryService;

    public ExecutiveSecretaryController(ExecutiveSecretaryService secretaryService) {
        this.secretaryService = secretaryService;
    }

    @GetMapping("/briefing")
    public ResponseEntity<ExecutiveBriefingResponse> getDailyBriefing() {
        return ResponseEntity.ok(secretaryService.getDailyBriefing());
    }

    @PostMapping("/parse-command")
    public ResponseEntity<TaskResponse> parseCommand(@Valid @RequestBody DirectorCommandRequest request) {
        return ResponseEntity.ok(secretaryService.parseAndExecuteDirectorCommand(request));
    }

    @GetMapping("/meeting-dossier/{taskId}")
    public ResponseEntity<MeetingDossierResponse> getMeetingDossier(@PathVariable Long taskId) {
        return ResponseEntity.ok(secretaryService.generateMeetingDossier(taskId));
    }

    @PostMapping("/follow-up-delegation/{taskId}")
    public ResponseEntity<Map<String, Object>> followUpDelegation(@PathVariable Long taskId) {
        boolean sent = secretaryService.triggerDelegationFollowup(taskId);
        return ResponseEntity.ok(Map.of(
                "success", sent,
                "taskId", taskId,
                "message", "Đã gửi thông báo thúc tiến độ tới cấp dưới!"
        ));
    }
}
