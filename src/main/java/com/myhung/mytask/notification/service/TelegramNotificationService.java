package com.myhung.mytask.notification.service;

import com.myhung.mytask.setting.service.SystemSettingService;
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
    private String defaultBotToken;

    @Value("${telegram.bot.chat-id:}")
    private String defaultChatId;

    @Value("${telegram.bot.enabled:false}")
    private boolean defaultEnabled;

    private final SystemSettingService settingService;
    private final RestTemplate restTemplate;

    public TelegramNotificationService(SystemSettingService settingService, RestTemplate restTemplate) {
        this.settingService = settingService;
        this.restTemplate = restTemplate;
    }

    public boolean sendNotification(String message) {
        String botToken = settingService.getValue("telegram_bot_token", defaultBotToken);
        String chatId = settingService.getValue("telegram_chat_id", defaultChatId);
        String enabledStr = settingService.getValue("telegram_enabled", String.valueOf(defaultEnabled));
        boolean enabled = Boolean.parseBoolean(enabledStr);

        if (botToken != null) {
            botToken = botToken.trim().replaceAll("^\"|\"$|^'|'$", "");
        }
        if (chatId != null) {
            chatId = chatId.trim().replaceAll("^\"|\"$|^'|'$", "");
        }

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
            log.error("Failed to send Telegram notification (botTokenPrefix={}): {}",
                    (botToken != null && botToken.length() > 5) ? botToken.substring(0, 5) + "..." : "invalid",
                    e.getMessage(), e);
            return false;
        }
    }
}
