package com.myhung.mytask.notification.scheduler;

import com.myhung.mytask.notification.service.TelegramNotificationService;
import com.myhung.mytask.plan.dto.DailyPlanRequest;
import com.myhung.mytask.plan.dto.PlanItemRequest;
import com.myhung.mytask.plan.repository.DailyPlanRepository;
import com.myhung.mytask.plan.service.PlanService;
import com.myhung.mytask.task.dto.TaskResponse;
import com.myhung.mytask.task.entity.TaskSource;
import com.myhung.mytask.task.service.TaskService;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class NightPlanReminderScheduler {

    private static final Logger log = LoggerFactory.getLogger(NightPlanReminderScheduler.class);

    private final TaskService taskService;
    private final PlanService planService;
    private final DailyPlanRepository dailyPlanRepository;
    private final TelegramNotificationService telegramNotificationService;

    public NightPlanReminderScheduler(TaskService taskService,
                                      PlanService planService,
                                      DailyPlanRepository dailyPlanRepository,
                                      TelegramNotificationService telegramNotificationService) {
        this.taskService = taskService;
        this.planService = planService;
        this.dailyPlanRepository = dailyPlanRepository;
        this.telegramNotificationService = telegramNotificationService;
    }

    @Scheduled(cron = "${mytask.reminder.cron:0 0 21 * * ?}")
    public void runNightPlanReminder() {
        triggerReminderNow();
    }

    public String triggerReminderNow() {
        log.info("Executing Night Plan Reminder Task...");
        LocalDate tomorrow = LocalDate.now().plusDays(1);

        // 1. Fetch overdue tasks & stale tasks (pending > 2 days)
        List<TaskResponse> overdueTasks = taskService.getOverdueTasks();
        List<TaskResponse> staleTasks = taskService.getStaleTasks(2);
        List<TaskResponse> bossTasks = staleTasks.stream()
                .filter(t -> t.source() == TaskSource.BOSS)
                .toList();

        // 2. Auto-generate draft daily plan for tomorrow if not already present
        boolean planCreated = false;
        if (dailyPlanRepository.findByPlanDate(tomorrow).isEmpty()) {
            List<TaskResponse> candidateTasks = taskService.getOverdueAndHighPriorityTasks();
            if (!candidateTasks.isEmpty()) {
                List<PlanItemRequest> items = new ArrayList<>();
                for (int i = 0; i < candidateTasks.size(); i++) {
                    TaskResponse t = candidateTasks.get(i);
                    items.add(PlanItemRequest.builder()
                            .taskId(t.id())
                            .orderIndex(i + 1)
                            .plannedMinutes(t.estimatedMinutes() != null ? t.estimatedMinutes() : 30)
                            .done(false)
                            .build());
                }
                DailyPlanRequest request = DailyPlanRequest.builder()
                        .planDate(tomorrow)
                        .note("Tự động tạo nháp bởi Night Auto-Planner lúc 21:00")
                        .items(items)
                        .build();
                planService.create(request);
                planCreated = true;
                log.info("Auto-created draft plan for tomorrow ({}) with {} items", tomorrow, items.size());
            }
        }

        // 3. Construct Notification Message
        StringBuilder sb = new StringBuilder();
        sb.append("🌙 *[DirectorOS] ĐẾN GIỜ LẬP KẾ HOẠCH CHO NGÀY MAI (21:00)*\n\n");

        if (!bossTasks.isEmpty()) {
            sb.append("⚠️ *CẢNH BÁO VIỆC SẾP GIAO ĐANG BỊ NGUY CƠ QUÊN:* ").append(bossTasks.size()).append(" việc!\n");
            for (TaskResponse t : bossTasks) {
                sb.append(" • ").append(t.title()).append(" (Giao bởi: ").append(t.assignedBy() != null ? t.assignedBy() : "Sếp").append(")\n");
            }
            sb.append("\n");
        }

        if (!overdueTasks.isEmpty()) {
            sb.append("🔴 *CÔNG VIỆC QUÁ HẠN:* ").append(overdueTasks.size()).append(" việc!\n");
            for (TaskResponse t : overdueTasks) {
                sb.append(" • ").append(t.title()).append(" (Hạn: ").append(t.dueDate()).append(")\n");
            }
            sb.append("\n");
        }

        if (planCreated) {
            sb.append("✨ *Hệ thống đã tự động tạo trước Bản nháp Plan cho ngày ").append(tomorrow).append("*.\n");
        } else {
            sb.append("📌 *Đã có sẵn Plan cho ngày ").append(tomorrow).append("*.\n");
        }

        sb.append("👉 Vui lòng mở ứng dụng DirectorOS để xác nhận hoặc điều chỉnh danh sách trước khi đi ngủ!");

        String message = sb.toString();
        telegramNotificationService.sendNotification(message);
        return message;
    }
}
