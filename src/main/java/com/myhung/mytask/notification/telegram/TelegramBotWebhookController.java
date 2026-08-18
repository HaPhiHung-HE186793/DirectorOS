package com.myhung.mytask.notification.telegram;

import com.myhung.mytask.plan.dto.DailyPlanResponse;
import com.myhung.mytask.plan.dto.PlanItemResponse;
import com.myhung.mytask.plan.service.PlanService;
import com.myhung.mytask.task.dto.TaskFilterRequest;
import com.myhung.mytask.task.dto.TaskRequest;
import com.myhung.mytask.task.dto.TaskResponse;
import com.myhung.mytask.task.entity.TaskSource;
import com.myhung.mytask.task.entity.TaskStatus;
import com.myhung.mytask.task.service.TaskService;
import java.util.List;
import java.util.Map;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/notifications/telegram-webhook")
public class TelegramBotWebhookController {

    private final TelegramTaskParser taskParser;
    private final TaskService taskService;
    private final PlanService planService;

    public TelegramBotWebhookController(TelegramTaskParser taskParser,
                                        TaskService taskService,
                                        PlanService planService) {
        this.taskParser = taskParser;
        this.taskService = taskService;
        this.planService = planService;
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> handleTelegramWebhook(@RequestBody Map<String, Object> body) {
        String text = "";
        if (body.containsKey("text")) {
            text = String.valueOf(body.get("text"));
        } else if (body.containsKey("message") && body.get("message") instanceof Map) {
            Map<?, ?> message = (Map<?, ?>) body.get("message");
            if (message.containsKey("text")) {
                text = String.valueOf(message.get("text"));
            }
        }

        String replyMessage;
        if (text.startsWith("/tasks")) {
            replyMessage = handleListTasks();
        } else if (text.startsWith("/plan")) {
            replyMessage = handleTodayPlan();
        } else if (text.startsWith("/add") || !text.startsWith("/")) {
            replyMessage = handleAddTask(text);
        } else {
            replyMessage = """
                    🤖 *DirectorOS Telegram Assistant*
                    
                    Các lệnh hỗ trợ:
                    - `/add <nội dung>`: Thêm nhanh task (VD: `/add Review báo cáo doanh thu sếp Minh giao ngày mai`)
                    - `/tasks`: Xem danh sách việc chưa hoàn thành
                    - `/plan`: Xem kế hoạch hôm nay
                    """;
        }

        return ResponseEntity.ok(Map.of(
                "success", true,
                "replyText", replyMessage
        ));
    }

    private String handleAddTask(String text) {
        try {
            TaskRequest request = taskParser.parse(text);
            TaskResponse created = taskService.create(request);

            return String.format(
                    "✅ *Đã tự động tạo Task mới thành công!*\n\n" +
                    "📌 *Tiêu đề:* %s\n" +
                    "🏷️ *Nguồn việc:* %s%s\n" +
                    "⚡ *Ưu tiên:* %s\n" +
                    "📅 *Hạn chót:* %s\n" +
                    "⏳ *Thời gian:* %d phút",
                    created.title(),
                    created.source(),
                    created.assignedBy() != null ? " (" + created.assignedBy() + ")" : "",
                    created.priority(),
                    created.dueDate(),
                    created.estimatedMinutes()
            );
        } catch (Exception e) {
            return "❌ *Lỗi tạo Task:* " + e.getMessage();
        }
    }

    private String handleListTasks() {
        TaskFilterRequest filter = TaskFilterRequest.builder()
                .status(TaskStatus.TODO)
                .build();
        List<TaskResponse> tasks = taskService.getAll(filter, Pageable.unpaged()).getContent();

        if (tasks.isEmpty()) {
            return "🎉 Không có nhiệm vụ nào đang chờ xử lý!";
        }

        StringBuilder sb = new StringBuilder("📋 *Danh sách việc cần làm (" + tasks.size() + " task):*\n\n");
        for (int i = 0; i < tasks.size(); i++) {
            TaskResponse t = tasks.get(i);
            String bossTag = t.source() == TaskSource.BOSS ? " 💼 [Sếp giao]" : "";
            sb.append(i + 1).append(". ").append(t.title()).append(bossTag)
              .append("\n   📅 Hạn: ").append(t.dueDate() != null ? t.dueDate() : "Chưa đặt")
              .append(" | ⚡ ").append(t.priority()).append("\n");
        }
        return sb.toString();
    }

    private String handleTodayPlan() {
        try {
            DailyPlanResponse plan = planService.getToday();
            if (plan == null || plan.items().isEmpty()) {
                return "🌙 Chưa có Plan cho hôm nay. Gõ `/add` để thêm việc hoặc lên Web chốt Plan nhé!";
            }

            StringBuilder sb = new StringBuilder("✨ *Kế hoạch hôm nay (" + plan.planDate() + "):*\n\n");
            for (int i = 0; i < plan.items().size(); i++) {
                PlanItemResponse item = plan.items().get(i);
                String statusIcon = item.done() ? "✅" : "⏹️";
                sb.append(statusIcon).append(" ").append(i + 1).append(". ").append(item.taskTitle())
                  .append(" (").append(item.plannedMinutes()).append("m)\n");
            }
            return sb.toString();
        } catch (Exception e) {
            return "🌙 Chưa có Plan cho hôm nay. Gõ `/add` để thêm việc hoặc lên Web chốt Plan nhé!";
        }
    }
}
