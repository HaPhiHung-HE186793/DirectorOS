package com.myhung.mytask.notification.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class EmailNotificationService {

    private static final Logger log = LoggerFactory.getLogger(EmailNotificationService.class);

    @Value("${mytask.email.enabled:false}")
    private boolean enabled;

    @Value("${mytask.email.recipient:}")
    private String recipientEmail;

    public boolean sendEmailNotification(String subject, String content, String targetEmail) {
        String emailToUse = (targetEmail != null && !targetEmail.isBlank()) ? targetEmail : recipientEmail;

        if (!enabled && (targetEmail == null || targetEmail.isBlank())) {
            log.info("Email notification skipped (enabled={}, recipient='{}'). Subject: '{}'. Content:\n{}",
                    enabled, emailToUse, subject, content);
            return false;
        }

        try {
            // Simulated / Mock Email Dispatch Engine for myTask
            log.info("📧 [Email Sent Successfully] To: {} | Subject: '{}' | Body length: {} chars",
                    emailToUse, subject, content != null ? content.length() : 0);
            return true;
        } catch (Exception e) {
            log.error("Failed to send Email notification to {}: {}", emailToUse, e.getMessage(), e);
            return false;
        }
    }
}
