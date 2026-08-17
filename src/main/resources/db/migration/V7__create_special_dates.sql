-- Flyway Migration V7: Create Special Dates table for birthdays, holidays, anniversaries
-- This is a core table for the Personal Calendar feature

CREATE TABLE IF NOT EXISTS special_date (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    event_date DATE NOT NULL,
    lunar_day INTEGER,
    lunar_month INTEGER,
    is_lunar_based BOOLEAN DEFAULT FALSE,
    event_type VARCHAR(30) NOT NULL,
    recurring_yearly BOOLEAN DEFAULT TRUE,
    color VARCHAR(20) DEFAULT '#f59e0b',
    icon VARCHAR(10),
    note TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_special_date_event_date ON special_date(event_date);
CREATE INDEX idx_special_date_event_type ON special_date(event_type);
CREATE INDEX idx_special_date_recurring ON special_date(recurring_yearly);

-- Seed Vietnamese National Holidays (Solar/Dương lịch)
INSERT INTO special_date (title, event_date, event_type, recurring_yearly, color, icon, note) VALUES
('Tết Dương lịch', '2026-01-01', 'HOLIDAY', true, '#ef4444', '🎉', 'Ngày đầu năm mới dương lịch'),
('Ngày Giải phóng miền Nam', '2026-04-30', 'HOLIDAY', true, '#ef4444', '🇻🇳', 'Ngày thống nhất đất nước'),
('Ngày Quốc tế Lao động', '2026-05-01', 'HOLIDAY', true, '#ef4444', '💪', 'Ngày nghỉ lễ'),
('Ngày Quốc khánh', '2026-09-02', 'HOLIDAY', true, '#ef4444', '🇻🇳', 'Ngày Quốc khánh nước CHXHCN Việt Nam'),
('Giỗ Tổ Hùng Vương', '2026-04-08', 'HOLIDAY', true, '#ef4444', '🏛️', 'Mùng 10 tháng 3 Âm lịch - ngày thay đổi hàng năm'),
('Ngày Phụ nữ Việt Nam', '2026-10-20', 'ANNIVERSARY', true, '#ec4899', '🌸', 'Ngày Phụ nữ Việt Nam 20/10'),
('Ngày Nhà giáo Việt Nam', '2026-11-20', 'ANNIVERSARY', true, '#8b5cf6', '📚', 'Ngày Nhà giáo 20/11'),
('Ngày Valentine', '2026-02-14', 'ANNIVERSARY', true, '#ec4899', '❤️', 'Ngày lễ tình nhân'),
('Ngày Quốc tế Phụ nữ', '2026-03-08', 'ANNIVERSARY', true, '#ec4899', '🌷', 'Ngày 8/3'),
('Giáng sinh', '2026-12-25', 'HOLIDAY', true, '#22c55e', '🎄', 'Ngày lễ Giáng sinh');
