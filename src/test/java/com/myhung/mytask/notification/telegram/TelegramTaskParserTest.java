package com.myhung.mytask.notification.telegram;

import com.myhung.mytask.task.dto.TaskRequest;
import com.myhung.mytask.task.entity.TaskPriority;
import com.myhung.mytask.task.entity.TaskSource;
import java.time.LocalDate;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class TelegramTaskParserTest {

    private TelegramTaskParser parser;

    @BeforeEach
    void setUp() {
        parser = new TelegramTaskParser();
    }

    @Test
    void parse_BossTaskWithUrgent_Success() {
        String msg = "/add Review báo cáo tài chính Sếp Minh giao gấp ngày mai";
        TaskRequest req = parser.parse(msg);

        assertNotNull(req);
        assertEquals(TaskSource.BOSS, req.getSource());
        assertEquals("Sếp Minh", req.getAssignedBy());
        assertEquals(TaskPriority.URGENT, req.getPriority());
        assertEquals(LocalDate.now().plusDays(1), req.getDueDate());
    }

    @Test
    void parse_SelfTaskToday_Success() {
        String msg = "/add Đọc 30 trang sách hôm nay";
        TaskRequest req = parser.parse(msg);

        assertNotNull(req);
        assertEquals(TaskSource.SELF, req.getSource());
        assertNull(req.getAssignedBy());
        assertEquals(TaskPriority.MEDIUM, req.getPriority());
        assertEquals(LocalDate.now(), req.getDueDate());
    }
}
