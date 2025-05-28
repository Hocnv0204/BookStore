package com.bookstore.backend.service.impl;

import com.bookstore.backend.configuration.GeminiConfig;
import com.bookstore.backend.dto.request.GeminiRequest;
import com.bookstore.backend.dto.response.GeminiResponse;
import com.bookstore.backend.service.GeminiService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class GeminiServiceImpl implements GeminiService {

    private final GeminiConfig geminiConfig;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public GeminiResponse askGemini(GeminiRequest request) {
        try {
            // Tạo sessionId nếu chưa có
            String sessionId = request.getSessionId();
            if (sessionId == null || sessionId.isEmpty()) {
                sessionId = UUID.randomUUID().toString();
            }

            RestTemplate restTemplate = new RestTemplate();
            String url = geminiConfig.getBaseUrl() + "?key=" + geminiConfig.getApiKey();

            // Tạo request body theo format của Gemini API
            Map<String, Object> requestBody = new HashMap<>();
            Map<String, Object> contentMap = new HashMap<>();
            Map<String, String> part = new HashMap<>();
            
            part.put("text", request.getPrompt());
            contentMap.put("parts", List.of(part));
            requestBody.put("contents", List.of(contentMap));

            // Cấu hình generation để giảm hallucination
            Map<String, Object> generationConfig = new HashMap<>();
            generationConfig.put("maxOutputTokens", geminiConfig.getMaxOutputTokens());
            generationConfig.put("temperature", geminiConfig.getTemperature());
            generationConfig.put("topP", geminiConfig.getTopP());
            generationConfig.put("topK", geminiConfig.getTopK());
            requestBody.put("generationConfig", generationConfig);
            
            // Thêm safety settings để đảm bảo response an toàn
            Map<String, Object> safetySettings = new HashMap<>();
            safetySettings.put("category", "HARM_CATEGORY_DANGEROUS_CONTENT");
            safetySettings.put("threshold", "BLOCK_MEDIUM_AND_ABOVE");
            requestBody.put("safetySettings", List.of(safetySettings));

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.POST, entity, String.class);

            // Parse response JSON
            String content = extractContentFromResponse(response.getBody());

            return GeminiResponse.builder()
                    .content(content)
                    .sessionId(sessionId)
                    .success(true)
                    .build();

        } catch (Exception e) {
            log.error("Error calling Gemini API: ", e);
            return GeminiResponse.builder()
                    .content("Xin lỗi, có lỗi xảy ra khi xử lý yêu cầu của bạn.")
                    .sessionId(request.getSessionId())
                    .success(false)
                    .error(e.getMessage())
                    .build();
        }
    }

    private String extractContentFromResponse(String responseBody) {
        try {
            JsonNode root = objectMapper.readTree(responseBody);
            JsonNode candidates = root.get("candidates");
            if (candidates != null && candidates.isArray() && candidates.size() > 0) {
                JsonNode firstCandidate = candidates.get(0);
                JsonNode content = firstCandidate.get("content");
                if (content != null) {
                    JsonNode parts = content.get("parts");
                    if (parts != null && parts.isArray() && parts.size() > 0) {
                        JsonNode firstPart = parts.get(0);
                        JsonNode text = firstPart.get("text");
                        if (text != null) {
                            return text.asText();
                        }
                    }
                }
            }
            return "Không nhận được phản hồi từ AI.";
        } catch (Exception e) {
            log.error("Error parsing Gemini response: ", e);
            return "Có lỗi khi xử lý phản hồi từ AI.";
        }
    }
}
