ALTER TABLE task ADD COLUMN task_category VARCHAR(50) DEFAULT 'ROUTINE';
ALTER TABLE task ADD COLUMN scheduled_time VARCHAR(50);
ALTER TABLE task ADD COLUMN is_director_decision BOOLEAN DEFAULT FALSE;

ALTER TABLE plan_item ADD COLUMN scheduled_time VARCHAR(50);

CREATE INDEX idx_task_category ON task(task_category);
