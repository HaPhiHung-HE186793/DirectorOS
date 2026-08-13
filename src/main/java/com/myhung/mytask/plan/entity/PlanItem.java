package com.myhung.mytask.plan.entity;

import com.myhung.mytask.task.entity.Task;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "plan_item")
public class PlanItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "daily_plan_id", nullable = false)
    private DailyPlan plan;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "task_id", nullable = false)
    private Task task;

    @Column(nullable = false)
    private Integer orderIndex;

    private Integer plannedMinutes;

    @Column(length = 50)
    private String scheduledTime;

    @Column(nullable = false)
    private boolean done;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public DailyPlan getPlan() { return plan; }
    public void setPlan(DailyPlan plan) { this.plan = plan; }

    public Task getTask() { return task; }
    public void setTask(Task task) { this.task = task; }

    public Integer getOrderIndex() { return orderIndex; }
    public void setOrderIndex(Integer orderIndex) { this.orderIndex = orderIndex; }

    public Integer getPlannedMinutes() { return plannedMinutes; }
    public void setPlannedMinutes(Integer plannedMinutes) { this.plannedMinutes = plannedMinutes; }

    public String getScheduledTime() { return scheduledTime; }
    public void setScheduledTime(String scheduledTime) { this.scheduledTime = scheduledTime; }

    public boolean isDone() { return done; }
    public void setDone(boolean done) { this.done = done; }
}
