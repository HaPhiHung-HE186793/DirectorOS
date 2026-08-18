package com.myhung.mytask.setting.service;

import com.myhung.mytask.setting.entity.SystemSetting;
import com.myhung.mytask.setting.repository.SystemSettingRepository;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class SystemSettingService {

    private final SystemSettingRepository settingRepository;
    private final Map<String, String> cache = new ConcurrentHashMap<>();

    @Value("${telegram.bot.token:}")
    private String defaultTelegramToken;

    @Value("${telegram.bot.chat-id:}")
    private String defaultTelegramChatId;

    @Value("${telegram.bot.enabled:true}")
    private String defaultTelegramEnabled;

    @Value("${email.notification.address:}")
    private String defaultEmailAddress;

    @Value("${email.notification.enabled:true}")
    private String defaultEmailEnabled;

    public SystemSettingService(SystemSettingRepository settingRepository) {
        this.settingRepository = settingRepository;
    }

    public String getValue(String key, String defaultValue) {
        if (key == null) return defaultValue != null ? defaultValue.trim() : null;
        String cleanKey = key.trim().toLowerCase();
        if (cache.containsKey(cleanKey)) {
            String cached = cache.get(cleanKey);
            return (cached != null && !cached.isBlank()) ? cached.trim() : defaultValue;
        }

        Optional<SystemSetting> setting = settingRepository.findById(cleanKey);
        if (setting.isPresent() && setting.get().getSettingValue() != null && !setting.get().getSettingValue().isBlank()) {
            String val = setting.get().getSettingValue().trim();
            cache.put(cleanKey, val);
            return val;
        }
        return defaultValue != null ? defaultValue.trim() : null;
    }

    public Map<String, String> getAllSettings() {
        List<SystemSetting> list = settingRepository.findAll();
        Map<String, String> map = new HashMap<>();
        for (SystemSetting setting : list) {
            String val = setting.getSettingValue() != null ? setting.getSettingValue().trim() : "";
            String key = setting.getSettingKey() != null ? setting.getSettingKey().toLowerCase().trim() : "";
            if (!key.isBlank()) {
                map.put(key, val);
                cache.put(key, val);
            }
        }

        if ((!map.containsKey("telegram_bot_token") || map.get("telegram_bot_token").isBlank())
                && defaultTelegramToken != null && !defaultTelegramToken.isBlank()) {
            map.put("telegram_bot_token", defaultTelegramToken.trim());
        }
        if ((!map.containsKey("telegram_chat_id") || map.get("telegram_chat_id").isBlank())
                && defaultTelegramChatId != null && !defaultTelegramChatId.isBlank()) {
            map.put("telegram_chat_id", defaultTelegramChatId.trim());
        }
        if (!map.containsKey("telegram_enabled") || map.get("telegram_enabled").isBlank()) {
            map.put("telegram_enabled", (defaultTelegramEnabled != null && !defaultTelegramEnabled.isBlank()) ? defaultTelegramEnabled.trim() : "true");
        }
        if ((!map.containsKey("email_address") || map.get("email_address").isBlank())
                && defaultEmailAddress != null && !defaultEmailAddress.isBlank()) {
            map.put("email_address", defaultEmailAddress.trim());
        }
        if (!map.containsKey("email_enabled") || map.get("email_enabled").isBlank()) {
            map.put("email_enabled", (defaultEmailEnabled != null && !defaultEmailEnabled.isBlank()) ? defaultEmailEnabled.trim() : "true");
        }

        return map;
    }

    @Transactional
    public void saveSetting(String key, String value) {
        if (key == null || key.isBlank()) return;
        String cleanKey = key.trim().toLowerCase();
        String cleanValue = (value != null) ? value.trim() : "";
        SystemSetting setting = SystemSetting.builder()
                .settingKey(cleanKey)
                .settingValue(cleanValue)
                .updatedAt(LocalDateTime.now())
                .build();
        settingRepository.save(setting);
        cache.put(cleanKey, cleanValue);
    }

    @Transactional
    public void saveSettings(Map<String, String> settings) {
        settings.forEach((key, value) -> {
            if (key != null && !key.isBlank()) {
                saveSetting(key, value);
            }
        });
    }
}
