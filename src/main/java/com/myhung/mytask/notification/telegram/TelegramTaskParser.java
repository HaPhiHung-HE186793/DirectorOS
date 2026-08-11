package com.myhung.mytask.notification.telegram;

import com.myhung.mytask.task.dto.TaskRequest;
import com.myhung.mytask.task.entity.TaskPriority;
import com.myhung.mytask.task.entity.TaskSource;
import com.myhung.mytask.task.entity.TaskStatus;
import java.time.LocalDate;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import org.springframework.stereotype.Component;

@Component
public class TelegramTaskParser {

    private static final Pattern BOSS_NAME_PATTERN = Pattern.compile("(?i)(sếp\\s+[\\p{L}\\w]+)");

    public TaskRequest parse(String text) {
        if (text == null || text.isBlank()) {
            throw new IllegalArgumentException("Nội dung tin nhắn không được để trống");
        }

        // Clean leading command /add or /create
        String cleanText = text.replaceFirst("(?i)^/(add|create|task)\\s*", "").trim();
        if (cleanText.isBlank()) {
            cleanText = text.trim();
        }

        String lower = cleanText.toLowerCase();

        // 1. Detect Source & AssignedBy
        TaskSource source = TaskSource.SELF;
        String assignedBy = null;

        if (lower.contains("sếp") || lower.contains("boss") || lower.contains("giao")) {
            source = TaskSource.BOSS;
            Matcher matcher = BOSS_NAME_PATTERN.matcher(cleanText);
            if (matcher.find()) {
                assignedBy = capitalizeWords(matcher.group(1));
            } else {
                assignedBy = "Sếp";
            }
        }

        // 2. Detect Priority
        TaskPriority priority = TaskPriority.MEDIUM;
        if (lower.contains("gấp") || lower.contains("khẩn") || lower.contains("urgent")) {
            priority = TaskPriority.URGENT;
        } else if (lower.contains("quan trọng") || lower.contains("high") || lower.contains("ưu tiên")) {
            priority = TaskPriority.HIGH;
        }

        // 3. Detect Due Date
        LocalDate dueDate = LocalDate.now().plusDays(1); // Default tomorrow
        if (lower.contains("hôm nay") || lower.contains("today")) {
            dueDate = LocalDate.now();
        } else if (lower.contains("ngày mai") || lower.contains(" mai ") || lower.endsWith(" mai")) {
            dueDate = LocalDate.now().plusDays(1);
        } else if (lower.contains("ngày kia") || lower.contains("mốt")) {
            dueDate = LocalDate.now().plusDays(2);
        }

        // Estimated minutes
        int estimatedMinutes = 45;
        if (priority == TaskPriority.URGENT) {
            estimatedMinutes = 60;
        }

        return TaskRequest.builder()
                .title(cleanText)
                .description("Tự động trích xuất từ Telegram message: \"" + text + "\"")
                .status(TaskStatus.TODO)
                .priority(priority)
                .source(source)
                .assignedBy(assignedBy)
                .dueDate(dueDate)
                .estimatedMinutes(estimatedMinutes)
                .build();
    }

    private String capitalizeWords(String input) {
        if (input == null || input.isEmpty()) return input;
        String[] words = input.split("\\s+");
        StringBuilder sb = new StringBuilder();
        for (String w : words) {
            if (!w.isEmpty()) {
                sb.append(Character.toUpperCase(w.charAt(0)))
                  .append(w.substring(1).toLowerCase())
                  .append(" ");
            }
        }
        return sb.toString().trim();
    }
}
