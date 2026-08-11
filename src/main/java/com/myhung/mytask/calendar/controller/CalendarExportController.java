package com.myhung.mytask.calendar.controller;

import com.myhung.mytask.plan.entity.DailyPlan;
import com.myhung.mytask.plan.entity.PlanItem;
import com.myhung.mytask.plan.repository.DailyPlanRepository;
import com.myhung.mytask.task.entity.Task;
import com.myhung.mytask.task.repository.TaskRepository;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Map;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/calendar")
public class CalendarExportController {

    private final TaskRepository taskRepository;
    private final DailyPlanRepository dailyPlanRepository;

    public CalendarExportController(TaskRepository taskRepository, DailyPlanRepository dailyPlanRepository) {
        this.taskRepository = taskRepository;
        this.dailyPlanRepository = dailyPlanRepository;
    }

    @GetMapping("/google-link/task/{taskId}")
    public ResponseEntity<Map<String, String>> getGoogleCalendarLink(@PathVariable Long taskId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new IllegalArgumentException("Task not found with id " + taskId));

        LocalDate date = task.getDueDate() != null ? task.getDueDate() : LocalDate.now();
        String dateStr = date.format(DateTimeFormatter.BASIC_ISO_DATE);

        String title = URLEncoder.encode("[myTask] " + task.getTitle(), StandardCharsets.UTF_8);
        String details = URLEncoder.encode(
                (task.getDescription() != null ? task.getDescription() : "") +
                "\n\nThời gian dự kiến: " + (task.getEstimatedMinutes() != null ? task.getEstimatedMinutes() : 30) + " phút" +
                "\nNguồn việc: " + task.getSource(),
                StandardCharsets.UTF_8
        );

        String googleUrl = String.format(
                "https://calendar.google.com/calendar/render?action=TEMPLATE&text=%s&dates=%s/%s&details=%s",
                title, dateStr, dateStr, details
        );

        return ResponseEntity.ok(Map.of("url", googleUrl));
    }

    @GetMapping(value = "/export/task/{taskId}.ics", produces = "text/calendar")
    public ResponseEntity<String> exportTaskIcs(@PathVariable Long taskId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new IllegalArgumentException("Task not found with id " + taskId));

        LocalDate date = task.getDueDate() != null ? task.getDueDate() : LocalDate.now();
        String dateStr = date.format(DateTimeFormatter.BASIC_ISO_DATE);

        StringBuilder ics = new StringBuilder();
        ics.append("BEGIN:VCALENDAR\r\n");
        ics.append("VERSION:2.0\r\n");
        ics.append("PRODID:-//myTask App//NONSGML v1.0//EN\r\n");
        ics.append("BEGIN:VEVENT\r\n");
        ics.append("UID:mytask-").append(task.getId()).append("@mytask.app\r\n");
        ics.append("SUMMARY:[myTask] ").append(escapeIcsText(task.getTitle())).append("\r\n");
        ics.append("DESCRIPTION:").append(escapeIcsText(task.getDescription() != null ? task.getDescription() : "")).append("\r\n");
        ics.append("DTSTART;VALUE=DATE:").append(dateStr).append("\r\n");
        ics.append("DTEND;VALUE=DATE:").append(dateStr).append("\r\n");
        ics.append("END:VEVENT\r\n");
        ics.append("END:VCALENDAR\r\n");

        HttpHeaders headers = new HttpHeaders();
        headers.setContentDisposition(ContentDisposition.attachment().filename("task-" + taskId + ".ics").build());
        headers.setContentType(MediaType.parseMediaType("text/calendar; charset=utf-8"));

        return ResponseEntity.ok().headers(headers).body(ics.toString());
    }

    @GetMapping(value = "/export/plan/{planId}.ics", produces = "text/calendar")
    public ResponseEntity<String> exportPlanIcs(@PathVariable Long planId) {
        DailyPlan plan = dailyPlanRepository.findById(planId)
                .orElseThrow(() -> new IllegalArgumentException("Plan not found with id " + planId));

        String dateStr = plan.getPlanDate().format(DateTimeFormatter.BASIC_ISO_DATE);

        StringBuilder ics = new StringBuilder();
        ics.append("BEGIN:VCALENDAR\r\n");
        ics.append("VERSION:2.0\r\n");
        ics.append("PRODID:-//myTask App//NONSGML v1.0//EN\r\n");

        for (PlanItem item : plan.getItems()) {
            Task t = item.getTask();
            ics.append("BEGIN:VEVENT\r\n");
            ics.append("UID:mytask-plan-").append(plan.getId()).append("-item-").append(item.getId()).append("@mytask.app\r\n");
            ics.append("SUMMARY:[myTask Plan] ").append(escapeIcsText(t.getTitle())).append("\r\n");
            ics.append("DESCRIPTION:Ghi chú: ").append(escapeIcsText(plan.getNote() != null ? plan.getNote() : "")).append("\r\n");
            ics.append("DTSTART;VALUE=DATE:").append(dateStr).append("\r\n");
            ics.append("DTEND;VALUE=DATE:").append(dateStr).append("\r\n");
            ics.append("END:VEVENT\r\n");
        }

        ics.append("END:VCALENDAR\r\n");

        HttpHeaders headers = new HttpHeaders();
        headers.setContentDisposition(ContentDisposition.attachment().filename("plan-" + plan.getPlanDate() + ".ics").build());
        headers.setContentType(MediaType.parseMediaType("text/calendar; charset=utf-8"));

        return ResponseEntity.ok().headers(headers).body(ics.toString());
    }

    private String escapeIcsText(String input) {
        if (input == null) return "";
        return input.replace("\\", "\\\\").replace(";", "\\;").replace(",", "\\,").replace("\n", "\\n");
    }
}
