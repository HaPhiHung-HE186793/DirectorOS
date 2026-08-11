package com.myhung.mytask.common;

import java.time.Instant;
import java.util.List;
import lombok.Builder;

@Builder
public record ApiError(
        Instant timestamp,
        int status,
        String error,
        String message,
        String path,
        List<FieldValidationError> fieldErrors) {
}
