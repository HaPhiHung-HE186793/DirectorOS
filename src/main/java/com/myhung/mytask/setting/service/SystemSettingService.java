package com.myhung.mytask.setting.service;

import com.myhung.mytask.setting.entity.SystemSetting;
import com.myhung.mytask.setting.repository.SystemSettingRepository;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class SystemSettingService {

    private final SystemSettingRepository settingRepository;

    public SystemSettingService(SystemSettingRepository settingRepository) {
        this.settingRepository = settingRepository;
    }

    public String getValue(String key, String defaultValue) {
        Optional<SystemSetting> setting = settingRepository.findById(key);
        if (setting.isPresent() && setting.get().getSettingValue() != null && !setting.get().getSettingValue().isBlank()) {
            return setting.get().getSettingValue();
        }
        return defaultValue;
    }

    public Map<String, String> getAllSettings() {
        List<SystemSetting> list = settingRepository.findAll();
        Map<String, String> map = new HashMap<>();
        for (SystemSetting setting : list) {
            map.put(setting.getSettingKey(), setting.getSettingValue());
        }
        return map;
    }

    @Transactional
    public void saveSetting(String key, String value) {
        SystemSetting setting = SystemSetting.builder()
                .settingKey(key)
                .settingValue(value)
                .updatedAt(LocalDateTime.now())
                .build();
        settingRepository.save(setting);
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
