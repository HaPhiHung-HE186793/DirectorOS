package com.myhung.mytask.secretary.service;

import com.myhung.mytask.notification.service.TelegramNotificationService;
import com.myhung.mytask.secretary.dto.DirectorCommandRequest;
import com.myhung.mytask.secretary.dto.ExecutiveBriefingResponse;
import com.myhung.mytask.secretary.dto.MeetingDossierResponse;
import com.myhung.mytask.task.dto.TaskRequest;
import com.myhung.mytask.task.dto.TaskResponse;
import com.myhung.mytask.task.entity.TaskCategory;
import com.myhung.mytask.task.entity.TaskPriority;
import com.myhung.mytask.task.entity.TaskSource;
import com.myhung.mytask.task.entity.TaskStatus;
import com.myhung.mytask.task.service.TaskService;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ExecutiveSecretaryService {

    private final TaskService taskService;
    private final TelegramNotificationService telegramNotificationService;

    public ExecutiveSecretaryService(TaskService taskService,
                                     TelegramNotificationService telegramNotificationService) {
        this.taskService = taskService;
        this.telegramNotificationService = telegramNotificationService;
    }

    @Transactional(readOnly = true)
    public ExecutiveBriefingResponse getDailyBriefing() {
        LocalDate today = LocalDate.now();
        List<TaskResponse> allTasks = taskService.getAllTasksList();
        List<TaskResponse> activeTasks = allTasks.stream()
                .filter(t -> t.status() != TaskStatus.DONE && t.status() != TaskStatus.CANCELLED)
                .toList();

        List<TaskResponse> decisionTasks = activeTasks.stream()
                .filter(t -> Boolean.TRUE.equals(t.isDirectorDecision()) || t.taskCategory() == TaskCategory.DECISION)
                .toList();

        List<TaskResponse> meetingTasks = activeTasks.stream()
                .filter(t -> t.taskCategory() == TaskCategory.MEETING || (t.title() != null && t.title().toLowerCase().contains("họp")))
                .toList();

        List<TaskResponse> urgentTasks = activeTasks.stream()
                .filter(t -> t.priority() == TaskPriority.URGENT || t.priority() == TaskPriority.HIGH)
                .toList();

        List<TaskResponse> delegatedTasks = activeTasks.stream()
                .filter(t -> t.taskCategory() == TaskCategory.DELEGATION || t.source() == TaskSource.BOSS)
                .toList();

        List<TaskResponse> overdueTasks = taskService.getOverdueTasks();

        int decisionLoadIndex = Math.min(100, (decisionTasks.size() * 25) + (urgentTasks.size() * 15) + (meetingTasks.size() * 10));
        String decisionLoadWarning;
        if (decisionLoadIndex > 75) {
            decisionLoadWarning = "⚠️ Tải quyết định cao (" + decisionLoadIndex + "%): Khuyên Giám đốc ủy quyền 2 tác vụ vận hành cho các Trưởng phòng để tránh quá tải tư duy.";
        } else if (decisionLoadIndex > 50) {
            decisionLoadWarning = "⚡ Tải quyết định vừa phải (" + decisionLoadIndex + "%): Hãy tập trung phê duyệt văn bản trong khung giờ 09:30 - 11:00.";
        } else {
            decisionLoadWarning = "🟢 Tải quyết định tối ưu (" + decisionLoadIndex + "%): Não bộ ở trạng thái tốt nhất cho tư duy chiến lược dài hạn.";
        }

        LocalTime now = LocalTime.now();
        String timeGreeting;
        if (now.getHour() < 12) {
            timeGreeting = "Kính chào Giám đốc! Chúc Giám đốc một buổi sáng làm việc tràn đầy năng lượng và hiệu quả.";
        } else if (now.getHour() < 18) {
            timeGreeting = "Kính chào Giám đốc! Báo cáo Thư ký cập nhật tình hình công việc chiều nay.";
        } else {
            timeGreeting = "Kính chào Giám đốc! Thư ký xin báo cáo tổng kết tình hình công việc cuối ngày.";
        }

        StringBuilder summary = new StringBuilder();
        summary.append(String.format("Hôm nay Giám đốc có tổng cộng %d công việc cần xử lý. ", activeTasks.size()));
        if (!decisionTasks.isEmpty()) {
            summary.append(String.format("Trong đó có %d hạng mục cần Giám đốc trực tiếp phê duyệt / quyết định. ", decisionTasks.size()));
        }
        if (!meetingTasks.isEmpty()) {
            summary.append(String.format("Lịch làm việc có %d cuộc họp quan trọng. ", meetingTasks.size()));
        }
        if (!overdueTasks.isEmpty()) {
            summary.append(String.format("Cảnh báo: Có %d việc quá hạn tồn đọng cần giải quyết ngay.", overdueTasks.size()));
        }

        List<String> advice = new ArrayList<>();
        if (!decisionTasks.isEmpty()) {
            advice.add("⚡ Khuyến nghị Giám đốc ưu tiên phê duyệt các văn bản & đề xuất trọng tâm vào khung giờ 09:30 - 11:00.");
        }
        if (!meetingTasks.isEmpty()) {
            advice.add("🤝 Thư ký đã chuẩn bị Hồ sơ 1-Trang cho các cuộc họp và tối ưu thời gian nghỉ 15 phút giữa các ca họp.");
        }
        if (urgentTasks.size() > 2) {
            advice.add("🔥 Khối lượng việc khẩn hôm nay khá cao, Thư ký đề xuất chuyển giao bớt tác vụ vận hành cho cấp dưới.");
        }
        if (advice.isEmpty()) {
            advice.add("✨ Lịch trình hôm nay rất ổn định. Giám đốc có thể dành thời gian cho định hướng chiến lược dài hạn.");
        }

        return ExecutiveBriefingResponse.builder()
                .date(today)
                .greeting(timeGreeting)
                .summaryText(summary.toString())
                .totalTasksCount(activeTasks.size())
                .directorDecisionsCount(decisionTasks.size())
                .meetingsCount(meetingTasks.size())
                .urgentCount(urgentTasks.size())
                .overdueCount(overdueTasks.size())
                .decisionLoadIndex(decisionLoadIndex)
                .decisionLoadWarning(decisionLoadWarning)
                .decisionTasks(decisionTasks)
                .meetingTasks(meetingTasks)
                .urgentTasks(urgentTasks)
                .delegatedTasks(delegatedTasks)
                .secretaryAdvice(advice)
                .build();
    }

    @Transactional
    public TaskResponse parseAndExecuteDirectorCommand(DirectorCommandRequest request) {
        String cmd = request.getCommand() != null ? request.getCommand().trim() : "";
        if (cmd.isEmpty()) {
            throw new IllegalArgumentException("Lệnh từ Giám đốc không được để trống");
        }

        String title = cmd;
        title = title.replaceAll("(?i)^(thư ký ơi|thư ký|nhắc tôi|nhắc|lên lịch|sắp xếp|tạo việc|giúp tôi)[,\\s]*", "");
        title = title.replaceAll("^[\\s,:\\.-]+", "");
        if (title.isEmpty()) title = cmd;

        TaskCategory category = TaskCategory.ROUTINE;
        TaskPriority priority = TaskPriority.MEDIUM;
        TaskSource source = TaskSource.SELF;
        boolean isDecision = false;
        String scheduledTime = null;
        int estimatedMinutes = 45;

        String lowerCmd = cmd.toLowerCase();

        if (lowerCmd.contains("họp") || lowerCmd.contains("gặp") || lowerCmd.contains("đối tác") || lowerCmd.contains("hội nghị")) {
            category = TaskCategory.MEETING;
            estimatedMinutes = 60;
        } else if (lowerCmd.contains("duyệt") || lowerCmd.contains("ký") || lowerCmd.contains("quyết định") || lowerCmd.contains("phê duyệt")) {
            category = TaskCategory.DECISION;
            isDecision = true;
            estimatedMinutes = 30;
        } else if (lowerCmd.contains("giao") || lowerCmd.contains("bảo") || lowerCmd.contains("nhắc phòng") || lowerCmd.contains("chỉ đạo")) {
            category = TaskCategory.DELEGATION;
            source = TaskSource.BOSS;
            estimatedMinutes = 20;
        } else if (lowerCmd.contains("chiến lược") || lowerCmd.contains("kế hoạch") || lowerCmd.contains("định hướng")) {
            category = TaskCategory.STRATEGIC;
            estimatedMinutes = 90;
        }

        if (lowerCmd.contains("gấp") || lowerCmd.contains("khẩn") || lowerCmd.contains("ngay") || lowerCmd.contains("hôm nay")) {
            priority = TaskPriority.URGENT;
        } else if (lowerCmd.contains("quan trọng") || isDecision) {
            priority = TaskPriority.HIGH;
        }

        Pattern timePattern = Pattern.compile("(\\d{1,2})[h:](\\d{2})?");
        Matcher matcher = timePattern.matcher(cmd);
        if (matcher.find()) {
            String hourStr = matcher.group(1);
            String minStr = matcher.group(2) != null ? matcher.group(2) : "00";
            int hour = Integer.parseInt(hourStr);
            int min = Integer.parseInt(minStr);
            scheduledTime = String.format("%02d:%02d - %02d:%02d", hour, min, (hour + 1) % 24, min);
        }

        TaskRequest taskRequest = TaskRequest.builder()
                .title(title)
                .description("Tạo tự động từ Chỉ đạo Giám đốc: \"" + cmd + "\"")
                .status(TaskStatus.TODO)
                .priority(priority)
                .source(source)
                .taskCategory(category)
                .scheduledTime(scheduledTime)
                .isDirectorDecision(isDecision)
                .assignedBy(category == TaskCategory.DELEGATION ? "Giám Đốc" : null)
                .dueDate(LocalDate.now())
                .estimatedMinutes(estimatedMinutes)
                .progressPercentage(0)
                .build();

        return taskService.create(taskRequest);
    }

    @Transactional(readOnly = true)
    public MeetingDossierResponse generateMeetingDossier(Long taskId) {
        TaskResponse task = taskService.getById(taskId);

        List<String> attendees = List.of(
                "Giám đốc (Chủ trì)",
                "Giám đốc Tài chính (CFO)",
                "Trưởng phòng Kế hoạch & Kinh doanh",
                "Thư ký AI (Ghi chép & Theo dõi Action Items)"
        );

        List<String> questions = List.of(
                "1. Chỉ số ROI kỳ vọng và điểm hòa vốn của dự án này là bao nhiêu?",
                "2. Rủi ro về dòng tiền trong 2 quý tới đã có phương án dự phòng chưa?",
                "3. Khung thời gian hoàn thành mốc 1 (Milestone 1) có cam kết đúng hạn không?"
        );

        List<String> context = List.of(
                "• Báo cáo tài chính sơ bộ đã được phòng Kế toán cập nhật sáng nay.",
                "• Quyết định trước đó: Giám đốc đã đồng ý duyệt ngân sách thử nghiệm 15%.",
                "• Cuộc họp dự kiến kéo dài 60 phút, cần chốt 2 hành động cụ thể cho CFO."
        );

        return new MeetingDossierResponse(
                task.id(),
                task.title(),
                task.scheduledTime() != null ? task.scheduledTime() : "Khung giờ linh hoạt trong ngày",
                "Đánh giá hiệu quả, phê duyệt định hướng và chốt mục tiêu hành động cho các Trưởng phòng.",
                attendees,
                questions,
                context,
                "Phê duyệt chính thức phương án & Giao deadline cụ thể cho từng Trưởng bộ phận."
        );
    }

    @Transactional
    public boolean triggerDelegationFollowup(Long taskId) {
        TaskResponse task = taskService.getById(taskId);
        String msg = String.format("📢 *[THƯ KÝ AI CHỈ ĐẠO]*\nThư ký AI xin chuyển lời Giám đốc nhắc nhở tiến độ công việc: *\"%s\"*.\nYêu cầu Trưởng bộ phận cập nhật kết quả trước 17:00 hôm nay!", task.title());
        return telegramNotificationService.sendNotification(msg);
    }
}
