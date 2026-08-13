package com.myhung.mytask.task.service;

import com.myhung.mytask.task.dto.TaskRequest;
import com.myhung.mytask.task.dto.TaskResponse;
import com.myhung.mytask.task.dto.TaskSubItemDto;
import com.myhung.mytask.task.entity.Task;
import com.myhung.mytask.task.entity.TaskCategory;
import com.myhung.mytask.task.entity.TaskStatus;
import com.myhung.mytask.task.entity.TaskSubItem;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import org.springframework.stereotype.Component;

@Component
public class TaskMapper {

    public TaskResponse toResponse(Task task) {
        List<TaskSubItemDto> subItemDtos = task.getSubItems().stream()
                .map(sub -> TaskSubItemDto.builder()
                        .id(sub.getId())
                        .title(sub.getTitle())
                        .completed(sub.isCompleted())
                        .orderIndex(sub.getOrderIndex())
                        .build())
                .toList();

        return TaskResponse.builder()
                .id(task.getId())
                .title(task.getTitle())
                .description(task.getDescription())
                .status(task.getStatus())
                .priority(task.getPriority())
                .source(task.getSource())
                .taskCategory(task.getTaskCategory() != null ? task.getTaskCategory() : TaskCategory.ROUTINE)
                .scheduledTime(task.getScheduledTime())
                .isDirectorDecision(task.getIsDirectorDecision() != null ? task.getIsDirectorDecision() : false)
                .assignedBy(task.getAssignedBy())
                .createdAt(task.getCreatedAt())
                .dueDate(task.getDueDate())
                .startedAt(task.getStartedAt())
                .completedAt(task.getCompletedAt())
                .estimatedMinutes(task.getEstimatedMinutes())
                .actualMinutes(task.getActualMinutes() != null ? task.getActualMinutes() : 0)
                .completedPomodoros(task.getCompletedPomodoros() != null ? task.getCompletedPomodoros() : 0)
                .progressPercentage(task.getProgressPercentage() != null ? task.getProgressPercentage() : 0)
                .subItems(subItemDtos)
                .tags(new HashSet<>(task.getTags()))
                .build();
    }

    public void updateEntity(Task task, TaskRequest request) {
        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setStatus(request.getStatus());
        task.setPriority(request.getPriority());
        task.setSource(request.getSource());
        if (request.getTaskCategory() != null) {
            task.setTaskCategory(request.getTaskCategory());
        }
        if (request.getScheduledTime() != null) {
            task.setScheduledTime(request.getScheduledTime());
        }
        if (request.getIsDirectorDecision() != null) {
            task.setIsDirectorDecision(request.getIsDirectorDecision());
        }
        task.setAssignedBy(request.getAssignedBy());
        task.setDueDate(request.getDueDate());
        task.setStartedAt(request.getStartedAt());
        task.setCompletedAt(request.getCompletedAt());
        task.setEstimatedMinutes(request.getEstimatedMinutes());

        if (request.getProgressPercentage() != null) {
            task.setProgressPercentage(request.getProgressPercentage());
        }

        task.getTags().clear();
        if (request.getTags() != null) {
            task.getTags().addAll(request.getTags());
        }

        // SubItems mapping
        if (request.getSubItems() != null) {
            task.getSubItems().clear();
            List<TaskSubItem> newSubItems = new ArrayList<>();
            for (int i = 0; i < request.getSubItems().size(); i++) {
                TaskSubItemDto dto = request.getSubItems().get(i);
                TaskSubItem item = new TaskSubItem();
                item.setId(dto.getId());
                item.setTask(task);
                item.setTitle(dto.getTitle());
                item.setCompleted(dto.isCompleted());
                item.setOrderIndex(dto.getOrderIndex() != null ? dto.getOrderIndex() : i);
                newSubItems.add(item);
            }
            task.getSubItems().addAll(newSubItems);

            // Auto calculate progress percentage
            if (!newSubItems.isEmpty()) {
                long completedCount = newSubItems.stream().filter(TaskSubItem::isCompleted).count();
                int calcProgress = (int) Math.round((double) completedCount * 100.0 / newSubItems.size());
                task.setProgressPercentage(calcProgress);

                if (calcProgress == 100) {
                    task.setStatus(TaskStatus.DONE);
                } else if (calcProgress > 0 && task.getStatus() == TaskStatus.TODO) {
                    task.setStatus(TaskStatus.IN_PROGRESS);
                }
            }
        }
    }
}
