package com.bookstore.backend.configuration;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "gemini")
@Data
public class GeminiConfig {
    private String apiKey;
    private String baseUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";
    private int maxOutputTokens = 1000;
    private double temperature = 0.1;
    private double topP = 0.8;
    private int topK = 10;
    private int maxHistorySize = 20;
}
