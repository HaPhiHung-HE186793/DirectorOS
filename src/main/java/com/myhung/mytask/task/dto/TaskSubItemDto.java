package com.myhung.mytask.task.dto;

public class TaskSubItemDto {

    private Long id;
    private String title;
    private boolean completed;
    private Integer orderIndex;

    public TaskSubItemDto() {}

    public TaskSubItemDto(Long id, String title, boolean completed, Integer orderIndex) {
        this.id = id;
        this.title = title;
        this.completed = completed;
        this.orderIndex = orderIndex;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public boolean isCompleted() { return completed; }
    public void setCompleted(boolean completed) { this.completed = completed; }

    public Integer getOrderIndex() { return orderIndex; }
    public void setOrderIndex(Integer orderIndex) { this.orderIndex = orderIndex; }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long id;
        private String title;
        private boolean completed;
        private Integer orderIndex;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder title(String title) { this.title = title; return this; }
        public Builder completed(boolean completed) { this.completed = completed; return this; }
        public Builder orderIndex(Integer orderIndex) { this.orderIndex = orderIndex; return this; }

        public TaskSubItemDto build() {
            return new TaskSubItemDto(id, title, completed, orderIndex);
        }
    }
}
