package com.bookstore.backend.service;

import com.bookstore.backend.dto.request.GeminiRequest;
import com.bookstore.backend.dto.response.GeminiResponse;

public interface GeminiService {
    GeminiResponse askGemini(GeminiRequest request);
}
