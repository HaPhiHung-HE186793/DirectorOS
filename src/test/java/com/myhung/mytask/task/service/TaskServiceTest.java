package com.myhung.mytask.task.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.myhung.mytask.task.dto.TaskRequest;
import com.myhung.mytask.task.dto.TaskResponse;
import com.myhung.mytask.task.entity.Task;
import com.myhung.mytask.task.entity.TaskPriority;
import com.myhung.mytask.task.entity.TaskSource;
import com.myhung.mytask.task.entity.TaskStatus;
import com.myhung.mytask.task.repository.TaskRepository;
import java.time.LocalDate;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class TaskServiceTest {

    @Mock
    private TaskRepository taskRepository;

    private TaskMapper taskMapper;

    @InjectMocks
    private TaskService taskService;

    @BeforeEach
    void setUp() {
        taskMapper = new TaskMapper();
        taskService = new TaskService(taskRepository, taskMapper);
    }

    @Test
    void createShouldSetCreatedAtAndPersistTask() {
        TaskRequest request = new TaskRequest();
        request.setTitle("Finish report");
        request.setStatus(TaskStatus.TODO);
        request.setPriority(TaskPriority.HIGH);
        request.setSource(TaskSource.SELF);
        request.setDueDate(LocalDate.now().plusDays(1));

        when(taskRepository.save(any(Task.class))).thenAnswer(invocation -> {
            Task task = invocation.getArgument(0);
            task.setId(1L);
            return task;
        });

        TaskResponse response = taskService.create(request);

        assertThat(response.id()).isEqualTo(1L);
        assertThat(response.createdAt()).isNotNull();
        verify(taskRepository).save(any(Task.class));
    }

    @Test
    void getOverdueAndHighPriorityTasksShouldReturnCombinedDistinctTasks() {
        Task overdue = new Task();
        overdue.setId(1L);
        overdue.setTitle("Overdue");
        overdue.setStatus(TaskStatus.TODO);
        overdue.setPriority(TaskPriority.LOW);
        overdue.setSource(TaskSource.SELF);

        Task urgent = new Task();
        urgent.setId(2L);
        urgent.setTitle("Urgent");
        urgent.setStatus(TaskStatus.TODO);
        urgent.setPriority(TaskPriority.URGENT);
        urgent.setSource(TaskSource.BOSS);

        when(taskRepository.findAll(any(org.springframework.data.jpa.domain.Specification.class)))
                .thenReturn(List.of(overdue))
                .thenReturn(List.of(overdue, urgent));

        List<TaskResponse> result = taskService.getOverdueAndHighPriorityTasks();

        assertThat(result).hasSize(2);
        assertThat(result).extracting(TaskResponse::id).containsExactlyInAnyOrder(1L, 2L);
    }
}
