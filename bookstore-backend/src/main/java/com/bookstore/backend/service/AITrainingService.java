package com.bookstore.backend.service;

import com.bookstore.backend.dto.request.GeminiRequest;
import com.bookstore.backend.dto.response.GeminiResponse;

public interface AITrainingService {
    GeminiResponse trainWithExamples(GeminiRequest request);
    String generateTrainingPrompt();
    void updateTrainingExamples();
}
