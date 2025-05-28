package com.bookstore.backend.controller;

import com.bookstore.backend.dto.request.GeminiRequest;
import com.bookstore.backend.dto.response.GeminiResponse;
import com.bookstore.backend.service.ChatbotService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/demo")
@RequiredArgsConstructor
public class ChatbotDemoController {

    private final ChatbotService chatbotService;

    @PostMapping("/chatbot")
    public ResponseEntity<Map<String, Object>> demoChatbot(@RequestBody Map<String, String> request) {
        try {
            String userMessage = request.get("message");
            String sessionId = request.get("sessionId");
            
            if (userMessage == null || userMessage.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(Map.of("error", "Message cannot be empty"));
            }

            GeminiRequest geminiRequest = GeminiRequest.builder()
                    .prompt(userMessage)
                    .sessionId(sessionId)
                    .userId(1L) // Demo user ID
                    .build();

            GeminiResponse response = chatbotService.chatWithBookstore(geminiRequest);

            Map<String, Object> result = new HashMap<>();
            result.put("message", response.getContent());
            result.put("sessionId", response.getSessionId());
            result.put("success", response.isSuccess());
            
            if (!response.isSuccess()) {
                result.put("error", response.getError());
            }

            return ResponseEntity.ok(result);

        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body(Map.of("error", "Internal server error: " + e.getMessage()));
        }
    }

    @GetMapping("/examples")
    public ResponseEntity<Map<String, Object>> getExamples() {
        Map<String, Object> examples = new HashMap<>();
        examples.put("examples", new String[]{
            "Tìm sách về lập trình Java",
            "Có sách nào của tác giả Nguyễn Nhật Ánh không?",
            "Sách Doraemon giá bao nhiêu?",
            "Còn hàng sách Totto-chan không?",
            "Tôi muốn mua sách thiếu nhi",
            "Cho tôi xem thông tin về cửa hàng"
        });
        examples.put("instructions", "Hãy thử hỏi bot về các cuốn sách trong cửa hàng. Bot chỉ trả lời dựa trên dữ liệu thực tế có trong database.");
        return ResponseEntity.ok(examples);
    }
}
