package com.myhung.mytask.notification.controller;

import com.myhung.mytask.notification.scheduler.NightPlanReminderScheduler;
import com.myhung.mytask.notification.service.EmailNotificationService;
import com.myhung.mytask.notification.service.TelegramNotificationService;
import java.util.Map;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NightPlanReminderScheduler nightPlanReminderScheduler;
    private final com.myhung.mytask.notification.scheduler.MorningExecutiveBriefingScheduler morningExecutiveBriefingScheduler;
    private final TelegramNotificationService telegramNotificationService;
    private final EmailNotificationService emailNotificationService;

    public NotificationController(NightPlanReminderScheduler nightPlanReminderScheduler,
                                  com.myhung.mytask.notification.scheduler.MorningExecutiveBriefingScheduler morningExecutiveBriefingScheduler,
                                  TelegramNotificationService telegramNotificationService,
                                  EmailNotificationService emailNotificationService) {
        this.nightPlanReminderScheduler = nightPlanReminderScheduler;
        this.morningExecutiveBriefingScheduler = morningExecutiveBriefingScheduler;
        this.telegramNotificationService = telegramNotificationService;
        this.emailNotificationService = emailNotificationService;
    }

    @PostMapping("/trigger-night-reminder")
    public ResponseEntity<Map<String, Object>> triggerNightReminder() {
        String message = nightPlanReminderScheduler.triggerReminderNow();
        return ResponseEntity.ok(Map.of(
                "success", true,
                "triggeredAt", java.time.LocalDateTime.now().toString(),
                "messageContent", message
        ));
    }

    @PostMapping("/trigger-morning-briefing")
    public ResponseEntity<Map<String, Object>> triggerMorningBriefing() {
        String message = morningExecutiveBriefingScheduler.triggerMorningBriefingNow();
        return ResponseEntity.ok(Map.of(
                "success", true,
                "triggeredAt", java.time.LocalDateTime.now().toString(),
                "messageContent", message
        ));
    }

    @PostMapping("/test-telegram")
    public ResponseEntity<Map<String, Object>> testTelegram(@RequestBody Map<String, String> body) {
        String customMsg = body.getOrDefault("message", "🔔 [DirectorOS Test] Tin nhắn thử nghiệm từ DirectorOS!");
        boolean sent = telegramNotificationService.sendNotification(customMsg);
        return ResponseEntity.ok(Map.of(
                "sent", sent,
                "message", customMsg
        ));
    }

    @PostMapping("/test-email")
    public ResponseEntity<Map<String, Object>> testEmail(@RequestBody Map<String, String> body) {
        String email = body.getOrDefault("email", "user@example.com");
        String subject = body.getOrDefault("subject", "📧 [DirectorOS] Kế hoạch làm việc hôm nay");
        String content = body.getOrDefault("message", "Chào bạn, đây là email nhắc nhở kế hoạch làm việc từ ứng dụng DirectorOS.");
        boolean sent = emailNotificationService.sendEmailNotification(subject, content, email);
        String reason = sent ? "Đã gửi email thành công!" : "Chưa gửi được: Máy chủ chưa cấu hình Gmail SMTP App Password (như SPRING_MAIL_USERNAME / SPRING_MAIL_PASSWORD).";
        return ResponseEntity.ok(Map.of(
                "sent", sent,
                "recipient", email,
                "subject", subject,
                "reason", reason
        ));
    }
}
