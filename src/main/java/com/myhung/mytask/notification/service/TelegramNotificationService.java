package com.myhung.mytask.notification.service;

import java.util.HashMap;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class TelegramNotificationService {

    private static final Logger log = LoggerFactory.getLogger(TelegramNotificationService.class);

    @Value("${telegram.bot.token:}")
    private String botToken;

    @Value("${telegram.bot.chat-id:}")
    private String chatId;

    @Value("${telegram.bot.enabled:false}")
    private boolean enabled;

    private final RestTemplate restTemplate = new RestTemplate();

    public boolean sendNotification(String message) {
        if (!enabled || botToken == null || botToken.isBlank() || chatId == null || chatId.isBlank()) {
            log.info("Telegram notification skipped (enabled={}, tokenPresent={}, chatIdPresent={}). Message content:\n{}",
                    enabled, botToken != null && !botToken.isBlank(), chatId != null && !chatId.isBlank(), message);
            return false;
        }

        try {
            String url = String.format("https://api.telegram.org/bot%s/sendMessage", botToken);
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            Map<String, Object> body = new HashMap<>();
            body.put("chat_id", chatId);
            body.put("text", message);
            body.put("parse_mode", "Markdown");

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);
            restTemplate.postForEntity(url, request, String.class);
            log.info("Telegram notification sent successfully to chat {}", chatId);
            return true;
        } catch (Exception e) {
            log.error("Failed to send Telegram notification: {}", e.getMessage(), e);
            return false;
        }
    }
}
