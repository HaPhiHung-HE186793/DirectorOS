CREATE TABLE task (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(20) NOT NULL,
    priority VARCHAR(20) NOT NULL,
    source VARCHAR(20) NOT NULL,
    assigned_by VARCHAR(255),
    created_at TIMESTAMP NOT NULL,
    due_date DATE,
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    estimated_minutes INTEGER
);

CREATE TABLE task_tags (
    task_id BIGINT NOT NULL,
    tag VARCHAR(50) NOT NULL,
    PRIMARY KEY (task_id, tag),
    CONSTRAINT fk_task_tags_task FOREIGN KEY (task_id) REFERENCES task(id) ON DELETE CASCADE
);

CREATE TABLE daily_plan (
    id BIGSERIAL PRIMARY KEY,
    plan_date DATE NOT NULL UNIQUE,
    created_at TIMESTAMP NOT NULL,
    note TEXT
);

CREATE TABLE plan_item (
    id BIGSERIAL PRIMARY KEY,
    daily_plan_id BIGINT NOT NULL,
    task_id BIGINT NOT NULL,
    order_index INTEGER NOT NULL,
    planned_minutes INTEGER,
    done BOOLEAN NOT NULL DEFAULT FALSE,
    CONSTRAINT fk_plan_item_daily_plan FOREIGN KEY (daily_plan_id) REFERENCES daily_plan(id) ON DELETE CASCADE,
    CONSTRAINT fk_plan_item_task FOREIGN KEY (task_id) REFERENCES task(id)
);

CREATE TABLE reminder (
    id BIGSERIAL PRIMARY KEY,
    task_id BIGINT NOT NULL,
    remind_at TIMESTAMP NOT NULL,
    sent BOOLEAN NOT NULL DEFAULT FALSE,
    channel VARCHAR(20) NOT NULL,
    CONSTRAINT fk_reminder_task FOREIGN KEY (task_id) REFERENCES task(id)
);

CREATE INDEX idx_task_status ON task(status);
CREATE INDEX idx_task_priority ON task(priority);
CREATE INDEX idx_task_due_date ON task(due_date);
CREATE INDEX idx_task_source ON task(source);
CREATE INDEX idx_daily_plan_date ON daily_plan(plan_date);
CREATE INDEX idx_reminder_remind_at ON reminder(remind_at);
