package com.myhung.mytask.secretary.dto;

import jakarta.validation.constraints.NotBlank;

public class DirectorCommandRequest {

    @NotBlank
    private String command;

    public DirectorCommandRequest() {}

    public DirectorCommandRequest(String command) {
        this.command = command;
    }

    public String getCommand() { return command; }
    public void setCommand(String command) { this.command = command; }
}
