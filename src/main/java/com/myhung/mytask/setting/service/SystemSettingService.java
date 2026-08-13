package com.myhung.mytask.setting.service;

import com.myhung.mytask.setting.entity.SystemSetting;
import com.myhung.mytask.setting.repository.SystemSettingRepository;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class SystemSettingService {

    private final SystemSettingRepository settingRepository;
    private final Map<String, String> cache = new ConcurrentHashMap<>();

    public SystemSettingService(SystemSettingRepository settingRepository) {
        this.settingRepository = settingRepository;
    }

    public String getValue(String key, String defaultValue) {
        if (cache.containsKey(key)) {
            String cached = cache.get(key);
            return (cached != null && !cached.isBlank()) ? cached.trim() : defaultValue;
        }

        Optional<SystemSetting> setting = settingRepository.findById(key);
        if (setting.isPresent() && setting.get().getSettingValue() != null && !setting.get().getSettingValue().isBlank()) {
            String val = setting.get().getSettingValue().trim();
            cache.put(key, val);
            return val;
        }
        return defaultValue != null ? defaultValue.trim() : null;
    }

    public Map<String, String> getAllSettings() {
        List<SystemSetting> list = settingRepository.findAll();
        Map<String, String> map = new HashMap<>();
        for (SystemSetting setting : list) {
            String val = setting.getSettingValue() != null ? setting.getSettingValue().trim() : "";
            map.put(setting.getSettingKey(), val);
            cache.put(setting.getSettingKey(), val);
        }
        return map;
    }

    @Transactional
    public void saveSetting(String key, String value) {
        String cleanValue = (value != null) ? value.trim() : "";
        SystemSetting setting = SystemSetting.builder()
                .settingKey(key)
                .settingValue(cleanValue)
                .updatedAt(LocalDateTime.now())
                .build();
        settingRepository.save(setting);
        cache.put(key, cleanValue);
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
