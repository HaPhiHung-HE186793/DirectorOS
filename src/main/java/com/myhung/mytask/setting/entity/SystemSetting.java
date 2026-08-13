package com.myhung.mytask.setting.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDateTime;

@Entity
@Table(name = "system_setting")
public class SystemSetting {

    @Id
    @Column(name = "setting_key", nullable = false, length = 100)
    private String settingKey;

    @Column(name = "setting_value", columnDefinition = "TEXT")
    private String settingValue;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public SystemSetting() {
    }

    public SystemSetting(String settingKey, String settingValue, LocalDateTime updatedAt) {
        this.settingKey = settingKey;
        this.settingValue = settingValue;
        this.updatedAt = updatedAt;
    }

    public String getSettingKey() {
        return settingKey;
    }

    public void setSettingKey(String settingKey) {
        this.settingKey = settingKey;
    }

    public String getSettingValue() {
        return settingValue;
    }

    public void setSettingValue(String settingValue) {
        this.settingValue = settingValue;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private String settingKey;
        private String settingValue;
        private LocalDateTime updatedAt;

        public Builder settingKey(String settingKey) {
            this.settingKey = settingKey;
            return this;
        }

        public Builder settingValue(String settingValue) {
            this.settingValue = settingValue;
            return this;
        }

        public Builder updatedAt(LocalDateTime updatedAt) {
            this.updatedAt = updatedAt;
            return this;
        }

        public SystemSetting build() {
            return new SystemSetting(settingKey, settingValue, updatedAt);
        }
    }
}
