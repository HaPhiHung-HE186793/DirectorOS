package com.myhung.mytask.calendar.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "special_date")
public class SpecialDate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 255)
    private String title;

    @Column(name = "event_date", nullable = false)
    private LocalDate eventDate;

    @Column(name = "lunar_day")
    private Integer lunarDay;

    @Column(name = "lunar_month")
    private Integer lunarMonth;

    @Column(name = "is_lunar_based")
    private Boolean isLunarBased = false;

    @Column(name = "event_type", nullable = false, length = 30)
    private String eventType; // BIRTHDAY, HOLIDAY, ANNIVERSARY, CUSTOM

    @Column(name = "recurring_yearly")
    private Boolean recurringYearly = true;

    @Column(length = 20)
    private String color = "#f59e0b";

    @Column(length = 10)
    private String icon;

    @Column(columnDefinition = "TEXT")
    private String note;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    public SpecialDate() {}

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public LocalDate getEventDate() { return eventDate; }
    public void setEventDate(LocalDate eventDate) { this.eventDate = eventDate; }

    public Integer getLunarDay() { return lunarDay; }
    public void setLunarDay(Integer lunarDay) { this.lunarDay = lunarDay; }

    public Integer getLunarMonth() { return lunarMonth; }
    public void setLunarMonth(Integer lunarMonth) { this.lunarMonth = lunarMonth; }

    public Boolean getIsLunarBased() { return isLunarBased; }
    public void setIsLunarBased(Boolean isLunarBased) { this.isLunarBased = isLunarBased; }

    public String getEventType() { return eventType; }
    public void setEventType(String eventType) { this.eventType = eventType; }

    public Boolean getRecurringYearly() { return recurringYearly; }
    public void setRecurringYearly(Boolean recurringYearly) { this.recurringYearly = recurringYearly; }

    public String getColor() { return color; }
    public void setColor(String color) { this.color = color; }

    public String getIcon() { return icon; }
    public void setIcon(String icon) { this.icon = icon; }

    public String getNote() { return note; }
    public void setNote(String note) { this.note = note; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
