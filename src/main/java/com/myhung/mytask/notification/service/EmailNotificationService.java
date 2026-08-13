package com.myhung.mytask.notification.service;

import com.myhung.mytask.setting.service.SystemSettingService;
import jakarta.mail.internet.MimeMessage;
import java.util.Properties;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailNotificationService {

    private static final Logger log = LoggerFactory.getLogger(EmailNotificationService.class);

    @Value("${spring.mail.host:smtp.gmail.com}")
    private String defaultSmtpHost;

    @Value("${spring.mail.port:587}")
    private int defaultSmtpPort;

    @Value("${spring.mail.username:}")
    private String defaultSmtpUsername;

    @Value("${spring.mail.password:}")
    private String defaultSmtpPassword;

    private final SystemSettingService settingService;

    public EmailNotificationService(SystemSettingService settingService) {
        this.settingService = settingService;
    }

    public boolean sendEmailNotification(String subject, String content, String targetEmail) {
        String recipient = (targetEmail != null && !targetEmail.isBlank())
                ? targetEmail
                : settingService.getValue("email_address", null);

        String emailEnabledStr = settingService.getValue("email_enabled", "true");
        boolean enabled = Boolean.parseBoolean(emailEnabledStr);

        if (!enabled || recipient == null || recipient.isBlank()) {
            log.info("Email notification skipped (enabled={}, recipient='{}'). Subject: '{}'",
                    enabled, recipient, subject);
            return false;
        }

        String host = settingService.getValue("smtp_host", defaultSmtpHost);
        String portStr = settingService.getValue("smtp_port", String.valueOf(defaultSmtpPort));
        String username = settingService.getValue("smtp_username", defaultSmtpUsername);
        String password = settingService.getValue("smtp_password", defaultSmtpPassword);

        int port = 587;
        try {
            port = Integer.parseInt(portStr);
        } catch (Exception ignored) {}

        if (username == null || username.isBlank() || password == null || password.isBlank()) {
            log.warn("SMTP credentials not configured (smtp_username/smtp_password missing). Logging email content to console for recipient {}:\n{}",
                    recipient, content);
            return false;
        }

        try {
            JavaMailSenderImpl mailSender = new JavaMailSenderImpl();
            mailSender.setHost(host);
            mailSender.setPort(port);
            mailSender.setUsername(username);
            mailSender.setPassword(password);

            Properties props = mailSender.getJavaMailProperties();
            props.put("mail.transport.protocol", "smtp");
            props.put("mail.smtp.auth", "true");
            props.put("mail.smtp.starttls.enable", "true");
            props.put("mail.smtp.starttls.required", "true");
            props.put("mail.smtp.connectiontimeout", "5000");
            props.put("mail.smtp.timeout", "5000");
            props.put("mail.smtp.writetimeout", "5000");

            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(username, "DirectorOS AI Secretary");
            helper.setTo(recipient);
            helper.setSubject(subject != null ? subject : "DirectorOS Executive Briefing");

            String htmlBody = buildExecutiveHtmlEmail(subject, content);
            helper.setText(htmlBody, true);

            mailSender.send(message);
            log.info("📧 [Real SMTP Email Sent Successfully] To: {} | Host: {} | Subject: '{}'", recipient, host, subject);
            return true;
        } catch (Exception e) {
            log.error("Failed to send real SMTP Email notification to {} via {}:{}: {}", recipient, host, port, e.getMessage(), e);
            return false;
        }
    }

    private String buildExecutiveHtmlEmail(String title, String rawContent) {
        String formattedContent = rawContent != null
                ? rawContent.replace("\n", "<br/>")
                : "";

        return """
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8"/>
                <style>
                    body { font-family: 'Segoe UI', Arial, sans-serif; background-color: #0f172a; color: #f8fafc; margin: 0; padding: 24px; }
                    .card { max-width: 600px; margin: 0 auto; background: #1e293b; border-radius: 16px; border: 1px solid #334155; padding: 32px; box-shadow: 0 10px 25px rgba(0,0,0,0.5); }
                    .header { border-bottom: 1px solid #334155; padding-bottom: 16px; margin-bottom: 24px; text-align: center; }
                    .title { font-size: 20px; font-weight: 800; color: #38bdf8; margin: 0; }
                    .subtitle { font-size: 12px; color: #94a3b8; margin-top: 4px; }
                    .content { font-size: 14px; line-height: 1.6; color: #e2e8f0; background: #090d16; padding: 20px; border-radius: 12px; border: 1px solid #1e293b; }
                    .footer { text-align: center; margin-top: 24px; font-size: 11px; color: #64748b; }
                    .badge { display: inline-block; padding: 4px 12px; background: #0369a1; color: #ffffff; border-radius: 9999px; font-size: 11px; font-weight: bold; }
                </style>
            </head>
            <body>
                <div class="card">
                    <div class="header">
                        <div class="badge">DirectorOS Chief of Staff</div>
                        <h1 class="title" style="margin-top: 12px;">%s</h1>
                        <div class="subtitle">Báo cáo tóm tắt công việc cho Giám đốc</div>
                    </div>
                    <div class="content">
                        %s
                    </div>
                    <div class="footer">
                        Email này được phát tự động từ Thư ký AI DirectorOS • Cấu hình tại Cài đặt Hệ thống
                    </div>
                </div>
            </body>
            </html>
            """.formatted(title != null ? title : "Báo Cáo Giám Đốc", formattedContent);
    }
}
