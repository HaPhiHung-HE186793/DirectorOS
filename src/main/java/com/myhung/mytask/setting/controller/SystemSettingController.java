package com.myhung.mytask.setting.controller;

import com.myhung.mytask.setting.service.SystemSettingService;
import java.util.Map;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/settings")
public class SystemSettingController {

    private final SystemSettingService settingService;

    public SystemSettingController(SystemSettingService settingService) {
        this.settingService = settingService;
    }

    @GetMapping
    public ResponseEntity<Map<String, String>> getAllSettings() {
        return ResponseEntity.ok(settingService.getAllSettings());
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> saveSettings(@RequestBody Map<String, String> settings) {
        settingService.saveSettings(settings);
        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Cập nhật cấu hình hệ thống thành công!"
        ));
    }
}
