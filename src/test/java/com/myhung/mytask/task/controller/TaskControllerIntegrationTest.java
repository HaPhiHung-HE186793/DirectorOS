package com.myhung.mytask.task.controller;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.myhung.mytask.task.entity.Task;
import com.myhung.mytask.task.entity.TaskPriority;
import com.myhung.mytask.task.entity.TaskSource;
import com.myhung.mytask.task.entity.TaskStatus;
import com.myhung.mytask.task.repository.TaskRepository;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Map;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class TaskControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private TaskRepository taskRepository;

    @BeforeEach
    void cleanUp() {
        taskRepository.deleteAll();
    }

    @Test
    void createAndGetTaskShouldWork() throws Exception {
        Map<String, Object> request = Map.of(
                "title", "Prepare sprint plan",
                "description", "Plan sprint backlog",
                "status", "TODO",
                "priority", "HIGH",
                "source", "MANAGER",
                "assignedBy", "Lead",
                "estimatedMinutes", 60
        );

        mockMvc.perform(post("/api/tasks")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").isNumber())
                .andExpect(jsonPath("$.title").value("Prepare sprint plan"));

        Task task = taskRepository.findAll().getFirst();

        mockMvc.perform(get("/api/tasks/{id}", task.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(task.getId()))
                .andExpect(jsonPath("$.status").value("TODO"));
    }

    @Test
    void overdueEndpointShouldReturnOnlyNonDonePastDueTasks() throws Exception {
        Task overdue = new Task();
        overdue.setTitle("Late task");
        overdue.setStatus(TaskStatus.TODO);
        overdue.setPriority(TaskPriority.MEDIUM);
        overdue.setSource(TaskSource.SELF);
        overdue.setCreatedAt(LocalDateTime.now().minusDays(5));
        overdue.setDueDate(LocalDate.now().minusDays(1));
        taskRepository.save(overdue);

        Task done = new Task();
        done.setTitle("Done task");
        done.setStatus(TaskStatus.DONE);
        done.setPriority(TaskPriority.HIGH);
        done.setSource(TaskSource.SELF);
        done.setCreatedAt(LocalDateTime.now().minusDays(5));
        done.setDueDate(LocalDate.now().minusDays(1));
        taskRepository.save(done);

        mockMvc.perform(get("/api/tasks/overdue"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].title").value("Late task"))
                .andExpect(jsonPath("$", org.hamcrest.Matchers.hasSize(1)));
    }
}
