package com.myhung.mytask.task.service;

import com.myhung.mytask.common.ResourceNotFoundException;
import com.myhung.mytask.task.dto.TaskFilterRequest;
import com.myhung.mytask.task.dto.TaskRequest;
import com.myhung.mytask.task.dto.TaskResponse;
import com.myhung.mytask.task.entity.Task;
import com.myhung.mytask.task.entity.TaskPriority;
import com.myhung.mytask.task.entity.TaskStatus;
import com.myhung.mytask.task.repository.TaskRepository;
import jakarta.persistence.criteria.Predicate;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;
    private final TaskMapper taskMapper;

    @Transactional
    public TaskResponse create(TaskRequest request) {
        Task task = new Task();
        taskMapper.updateEntity(task, request);
        task.setCreatedAt(LocalDateTime.now());
        return taskMapper.toResponse(taskRepository.save(task));
    }

    @Transactional
    public TaskResponse update(Long id, TaskRequest request) {
        Task task = findTaskOrThrow(id);
        taskMapper.updateEntity(task, request);
        return taskMapper.toResponse(taskRepository.save(task));
    }

    @Transactional(readOnly = true)
    public TaskResponse getById(Long id) {
        return taskMapper.toResponse(findTaskOrThrow(id));
    }

    @Transactional(readOnly = true)
    public Page<TaskResponse> getAll(TaskFilterRequest filter, Pageable pageable) {
        return taskRepository.findAll(buildFilterSpecification(filter), pageable)
                .map(taskMapper::toResponse);
    }

    @Transactional
    public void delete(Long id) {
        Task task = findTaskOrThrow(id);
        taskRepository.delete(task);
    }

    @Transactional(readOnly = true)
    public List<TaskResponse> getStaleTasks(int days) {
        LocalDateTime cutoff = LocalDateTime.now().minusDays(days);
        Specification<Task> spec = (root, query, cb) -> cb.and(
                cb.equal(root.get("status"), TaskStatus.TODO),
                cb.lessThan(root.get("createdAt"), cutoff)
        );
        return taskRepository.findAll(spec).stream().map(taskMapper::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public List<TaskResponse> getOverdueTasks() {
        Specification<Task> spec = (root, query, cb) -> cb.and(
                cb.isNotNull(root.get("dueDate")),
                cb.lessThan(root.get("dueDate"), LocalDate.now()),
                cb.notEqual(root.get("status"), TaskStatus.DONE)
        );
        return taskRepository.findAll(spec).stream().map(taskMapper::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public List<TaskResponse> getOverdueAndHighPriorityTasks() {
        Specification<Task> overdue = (root, query, cb) -> cb.and(
                cb.isNotNull(root.get("dueDate")),
                cb.lessThan(root.get("dueDate"), LocalDate.now()),
                cb.notEqual(root.get("status"), TaskStatus.DONE)
        );
        Specification<Task> highPriority = (root, query, cb) -> cb.and(
                root.get("priority").in(TaskPriority.HIGH, TaskPriority.URGENT),
                cb.notEqual(root.get("status"), TaskStatus.DONE)
        );

        Set<Task> result = new LinkedHashSet<>();
        result.addAll(taskRepository.findAll(overdue));
        result.addAll(taskRepository.findAll(highPriority));
        return result.stream().map(taskMapper::toResponse).toList();
    }

    private Task findTaskOrThrow(Long id) {
        return taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task with id " + id + " not found"));
    }

    private Specification<Task> buildFilterSpecification(TaskFilterRequest filter) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            if (filter.status() != null) {
                predicates.add(cb.equal(root.get("status"), filter.status()));
            }
            if (filter.priority() != null) {
                predicates.add(cb.equal(root.get("priority"), filter.priority()));
            }
            if (filter.source() != null) {
                predicates.add(cb.equal(root.get("source"), filter.source()));
            }
            if (filter.dueDateFrom() != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("dueDate"), filter.dueDateFrom()));
            }
            if (filter.dueDateTo() != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("dueDate"), filter.dueDateTo()));
            }
            return cb.and(predicates.toArray(Predicate[]::new));
        };
    }
}
