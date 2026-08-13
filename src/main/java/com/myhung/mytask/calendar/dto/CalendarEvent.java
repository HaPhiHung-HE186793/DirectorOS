package com.myhung.mytask.calendar.dto;

import java.time.LocalDateTime;

public class CalendarEvent {
    private String summary;
    private LocalDateTime start;
    private LocalDateTime end;
    private String description;
    private String location;
    private String accountName;
    private String emailAddress;

    public CalendarEvent() {}

    public CalendarEvent(String summary, LocalDateTime start, LocalDateTime end, String description, String location, String accountName, String emailAddress) {
        this.summary = summary;
        this.start = start;
        this.end = end;
        this.description = description;
        this.location = location;
        this.accountName = accountName;
        this.emailAddress = emailAddress;
    }

    public String getSummary() {
        return summary;
    }

    public void setSummary(String summary) {
        this.summary = summary;
    }

    public LocalDateTime getStart() {
        return start;
    }

    public void setStart(LocalDateTime start) {
        this.start = start;
    }

    public LocalDateTime getEnd() {
        return end;
    }

    public void setEnd(LocalDateTime end) {
        this.end = end;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
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

    public boolean overlapsWith(CalendarEvent other) {
        if (this.start == null || this.end == null || other.start == null || other.end == null) {
            return false;
        }
        return this.start.isBefore(other.end) && other.start.isBefore(this.end);
    }
}
