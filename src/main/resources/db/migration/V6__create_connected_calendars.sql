-- Flyway Migration V6: Create Connected Calendars & Multi-Account Email Schedule Hub

CREATE TABLE IF NOT EXISTS connected_calendar (
    id BIGSERIAL PRIMARY KEY,
    account_name VARCHAR(100) NOT NULL,
    email_address VARCHAR(150) NOT NULL,
    calendar_type VARCHAR(50) NOT NULL DEFAULT 'GMAIL',
    sync_url TEXT,
    color_tag VARCHAR(30) DEFAULT '#3b82f6',
    sync_enabled BOOLEAN DEFAULT TRUE,
    last_synced_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample default connected emails for demonstration
INSERT INTO connected_calendar (account_name, email_address, calendar_type, color_tag, sync_enabled, created_at)
VALUES 
('Gmail Công Ty A', 'myhung.executive@company-a.com', 'GMAIL', '#3b82f6', true, CURRENT_TIMESTAMP),
('Gmail Công Ty B', 'director.hung@company-b.com', 'GMAIL', '#8b5cf6', true, CURRENT_TIMESTAMP);
