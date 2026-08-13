package com.myhung.mytask.calendar.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "connected_calendar")
public class ConnectedCalendar {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "account_name", nullable = false, length = 100)
    private String accountName;

    @Column(name = "email_address", nullable = false, length = 150)
    private String emailAddress;

    @Column(name = "calendar_type", nullable = false, length = 50)
    private String calendarType;

    @Column(name = "sync_url", columnDefinition = "TEXT")
    private String syncUrl;

    @Column(name = "color_tag", length = 30)
    private String colorTag;

    @Column(name = "sync_enabled")
    private Boolean syncEnabled = true;

    @Column(name = "last_synced_at")
    private LocalDateTime lastSyncedAt;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    public ConnectedCalendar() {
    }

    public ConnectedCalendar(Long id, String accountName, String emailAddress, String calendarType, String syncUrl, String colorTag, Boolean syncEnabled, LocalDateTime lastSyncedAt, LocalDateTime createdAt) {
        this.id = id;
        this.accountName = accountName;
        this.emailAddress = emailAddress;
        this.calendarType = calendarType;
        this.syncUrl = syncUrl;
        this.colorTag = colorTag;
        this.syncEnabled = syncEnabled;
        this.lastSyncedAt = lastSyncedAt;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getAccountName() {
        return accountName;
    }

    public void setAccountName(String accountName) {
        this.accountName = accountName;
    }

    public String getEmailAddress() {
        return emailAddress;
    }

    public void setEmailAddress(String emailAddress) {
        this.emailAddress = emailAddress;
    }

    public String getCalendarType() {
        return calendarType;
    }

    public void setCalendarType(String calendarType) {
        this.calendarType = calendarType;
    }

    public String getSyncUrl() {
        return syncUrl;
    }

    public void setSyncUrl(String syncUrl) {
        this.syncUrl = syncUrl;
    }

    public String getColorTag() {
        return colorTag;
    }

    public void setColorTag(String colorTag) {
        this.colorTag = colorTag;
    }

    public Boolean getSyncEnabled() {
        return syncEnabled;
    }

    public void setSyncEnabled(Boolean syncEnabled) {
        this.syncEnabled = syncEnabled;
    }

    public LocalDateTime getLastSyncedAt() {
        return lastSyncedAt;
    }

    public void setLastSyncedAt(LocalDateTime lastSyncedAt) {
        this.lastSyncedAt = lastSyncedAt;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long id;
        private String accountName;
        private String emailAddress;
        private String calendarType;
        private String syncUrl;
        private String colorTag;
        private Boolean syncEnabled = true;
        private LocalDateTime lastSyncedAt;
        private LocalDateTime createdAt = LocalDateTime.now();

        public Builder id(Long id) {
            this.id = id;
            return this;
        }

        public Builder accountName(String accountName) {
            this.accountName = accountName;
            return this;
        }

        public Builder emailAddress(String emailAddress) {
            this.emailAddress = emailAddress;
            return this;
        }

        public Builder calendarType(String calendarType) {
            this.calendarType = calendarType;
            return this;
        }

        public Builder syncUrl(String syncUrl) {
            this.syncUrl = syncUrl;
            return this;
        }

        public Builder colorTag(String colorTag) {
            this.colorTag = colorTag;
            return this;
        }

        public Builder syncEnabled(Boolean syncEnabled) {
            this.syncEnabled = syncEnabled;
            return this;
        }

        public Builder lastSyncedAt(LocalDateTime lastSyncedAt) {
            this.lastSyncedAt = lastSyncedAt;
            return this;
        }

        public Builder createdAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
            return this;
        }

        public ConnectedCalendar build() {
            return new ConnectedCalendar(id, accountName, emailAddress, calendarType, syncUrl, colorTag, syncEnabled, lastSyncedAt, createdAt);
        }
    }
}
