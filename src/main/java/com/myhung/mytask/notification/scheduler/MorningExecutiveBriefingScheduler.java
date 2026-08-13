package com.myhung.mytask.notification.scheduler;

import com.myhung.mytask.notification.service.TelegramNotificationService;
import com.myhung.mytask.plan.dto.DailyPlanRequest;
import com.myhung.mytask.plan.dto.PlanItemRequest;
import com.myhung.mytask.plan.repository.DailyPlanRepository;
import com.myhung.mytask.plan.service.PlanService;
import com.myhung.mytask.secretary.dto.ExecutiveBriefingResponse;
import com.myhung.mytask.secretary.service.ExecutiveSecretaryService;
import com.myhung.mytask.task.dto.TaskResponse;
import com.myhung.mytask.task.service.TaskService;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class MorningExecutiveBriefingScheduler {

    private static final Logger log = LoggerFactory.getLogger(MorningExecutiveBriefingScheduler.class);

    private final TaskService taskService;
    private final PlanService planService;
    private final DailyPlanRepository dailyPlanRepository;
    private final ExecutiveSecretaryService secretaryService;
    private final TelegramNotificationService telegramNotificationService;

    public MorningExecutiveBriefingScheduler(TaskService taskService,
                                             PlanService planService,
                                             DailyPlanRepository dailyPlanRepository,
                                             ExecutiveSecretaryService secretaryService,
                                             TelegramNotificationService telegramNotificationService) {
        this.taskService = taskService;
        this.planService = planService;
        this.dailyPlanRepository = dailyPlanRepository;
        this.secretaryService = secretaryService;
        this.telegramNotificationService = telegramNotificationService;
    }

    @Scheduled(cron = "${mytask.morning.cron:0 0 7 * * ?}")
    public void runMorningBriefingScheduler() {
        triggerMorningBriefingNow();
    }

    public String triggerMorningBriefingNow() {
        log.info("Executing Morning Executive Briefing & Auto-Scheduling Task (07:00 AM)...");
        LocalDate today = LocalDate.now();

        // 1. Auto-generate & Time-block today's plan if not present
        if (dailyPlanRepository.findByPlanDate(today).isEmpty()) {
            List<TaskResponse> activeTasks = taskService.getOverdueAndHighPriorityTasks();
            if (activeTasks.isEmpty()) {
                activeTasks = taskService.getAllTasksList().stream()
                        .filter(t -> t.status() != com.myhung.mytask.task.entity.TaskStatus.DONE)
                        .limit(5)
                        .toList();
            }

            if (!activeTasks.isEmpty()) {
                String[] defaultTimeSlots = {
                        "09:00 - 10:30",
                        "10:30 - 11:30",
                        "13:30 - 15:00",
                        "15:00 - 16:30",
                        "16:30 - 17:30"
                };

                List<PlanItemRequest> items = new ArrayList<>();
                for (int i = 0; i < activeTasks.size(); i++) {
                    TaskResponse t = activeTasks.get(i);
                    String timeSlot = t.scheduledTime() != null
                            ? t.scheduledTime()
                            : defaultTimeSlots[Math.min(i, defaultTimeSlots.length - 1)];

                    items.add(PlanItemRequest.builder()
                            .taskId(t.id())
                            .orderIndex(i + 1)
                            .plannedMinutes(t.estimatedMinutes() != null ? t.estimatedMinutes() : 45)
                            .scheduledTime(timeSlot)
                            .done(false)
                            .build());
                }

                DailyPlanRequest planRequest = DailyPlanRequest.builder()
                        .planDate(today)
                        .note("Thư ký AI tự động lập & chia khung giờ lúc 07:00 sáng")
                        .items(items)
                        .build();

                planService.create(planRequest);
                log.info("Auto-created and scheduled today's executive plan with {} tasks", items.size());
            }
        }

        // 2. Fetch Executive Briefing
        ExecutiveBriefingResponse briefing = secretaryService.getDailyBriefing();

        // 3. Construct Executive Morning Push Notification
        StringBuilder sb = new StringBuilder();
        sb.append("☀️ *[THƯ KÝ AI] BÁO CÁO ĐẦU NGÀY CHO GIÁM ĐỐC*\n\n");
        sb.append("👋 ").append(briefing.greeting()).append("\n\n");
        sb.append("📊 *TỔNG QUAN LỊCH TRÌNH (*").append(today).append("*):*\n");
        sb.append(" • Tổng công việc: *").append(briefing.totalTasksCount()).append(" việc*\n");
        sb.append(" • Văn bản / Đề xuất cần duyệt: *").append(briefing.directorDecisionsCount()).append(" mục*\n");
        sb.append(" • Cuộc họp & Lịch hẹn: *").append(briefing.meetingsCount()).append(" cuộc*\n");
        sb.append(" • Xử lý khẩn cấp: *").append(briefing.urgentCount()).append(" việc*\n\n");

        if (briefing.secretaryAdvice() != null && !briefing.secretaryAdvice().isEmpty()) {
            sb.append("💡 *LỜI KHUYÊN TỪ THƯ KÝ:* \n");
            for (String advice : briefing.secretaryAdvice()) {
                sb.append(" ").append(advice).append("\n");
            }
            sb.append("\n");
        }

        sb.append("📱 *Giám đốc vui lòng mở app myTask để xem chi tiết Timeline và nghe Thư ký báo cáo giọng nói!*");

        String notificationMessage = sb.toString();
        telegramNotificationService.sendNotification(notificationMessage);
        return notificationMessage;
    }
}
