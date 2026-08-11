package com.myhung.mytask.task.service;

import com.myhung.mytask.task.dto.TaskRequest;
import com.myhung.mytask.task.dto.TaskResponse;
import com.myhung.mytask.task.entity.Task;
import java.util.HashSet;
import org.springframework.stereotype.Component;

@Component
public class TaskMapper {

    public TaskResponse toResponse(Task task) {
        return TaskResponse.builder()
                .id(task.getId())
                .title(task.getTitle())
                .description(task.getDescription())
                .status(task.getStatus())
                .priority(task.getPriority())
                .source(task.getSource())
                .assignedBy(task.getAssignedBy())
                .createdAt(task.getCreatedAt())
                .dueDate(task.getDueDate())
                .startedAt(task.getStartedAt())
                .completedAt(task.getCompletedAt())
                .estimatedMinutes(task.getEstimatedMinutes())
                .tags(new HashSet<>(task.getTags()))
                .build();
    }

    public void updateEntity(Task task, TaskRequest request) {
        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setStatus(request.getStatus());
        task.setPriority(request.getPriority());
        task.setSource(request.getSource());
        task.setAssignedBy(request.getAssignedBy());
        task.setDueDate(request.getDueDate());
        task.setStartedAt(request.getStartedAt());
        task.setCompletedAt(request.getCompletedAt());
        task.setEstimatedMinutes(request.getEstimatedMinutes());
        task.getTags().clear();
        if (request.getTags() != null) {
            task.getTags().addAll(request.getTags());
        }
    }
}
