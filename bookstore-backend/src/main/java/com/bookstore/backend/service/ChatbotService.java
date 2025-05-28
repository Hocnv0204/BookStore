package com.bookstore.backend.service;

import com.bookstore.backend.dto.request.GeminiRequest;
import com.bookstore.backend.dto.response.GeminiResponse;

public interface ChatbotService {
    GeminiResponse chatWithBookstore(GeminiRequest request);
}
