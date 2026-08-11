package com.myhung.mytask.task.dto;

import com.myhung.mytask.task.entity.TaskPriority;
import com.myhung.mytask.task.entity.TaskSource;
import com.myhung.mytask.task.entity.TaskStatus;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Set;
import lombok.Data;

@Data
public class TaskRequest {

    @NotBlank
    private String title;

    private String description;

    @NotNull
    private TaskStatus status;

    @NotNull
    private TaskPriority priority;

    @NotNull
    private TaskSource source;

    private String assignedBy;

    private LocalDate dueDate;

    private LocalDateTime startedAt;

    private LocalDateTime completedAt;

    @Min(1)
    private Integer estimatedMinutes;

    private Set<String> tags;
}
