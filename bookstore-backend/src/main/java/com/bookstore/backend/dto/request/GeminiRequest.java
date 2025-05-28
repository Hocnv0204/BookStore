package com.bookstore.backend.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GeminiRequest {
    private String prompt;
    private String sessionId;
    private Long userId; // Thêm field này nếu chưa có
}
