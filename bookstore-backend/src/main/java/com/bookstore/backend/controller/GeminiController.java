package com.bookstore.backend.controller;

import com.bookstore.backend.dto.request.GeminiRequest;
import com.bookstore.backend.dto.response.GeminiResponse;
import com.bookstore.backend.service.AITrainingService;
import com.bookstore.backend.service.ChatSessionService;
import com.bookstore.backend.service.ChatbotService;
import com.bookstore.backend.service.GeminiService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class GeminiController {

    private final GeminiService geminiService;
    private final ChatbotService chatbotService;
    private final ChatSessionService chatSessionService;
    private final AITrainingService aiTrainingService;

    // Endpoint gọi trực tiếp Gemini API
    @PostMapping("/gemini/ask")
    public ResponseEntity<GeminiResponse> askGemini(@RequestBody GeminiRequest request) {
        GeminiResponse response = geminiService.askGemini(request);
        return ResponseEntity.ok(response);
    }

    // Endpoint chatbot có tích hợp dữ liệu từ database
    @PostMapping("/chatbot/ask")
    public ResponseEntity<GeminiResponse> askChatbot(@RequestBody GeminiRequest request) {
        GeminiResponse response = chatbotService.chatWithBookstore(request);
        return ResponseEntity.ok(response);
    }

    // Endpoint chatbot với training nâng cao
    @PostMapping("/chatbot/ask-trained")
    public ResponseEntity<GeminiResponse> askTrainedChatbot(@RequestBody GeminiRequest request) {
        GeminiResponse response = aiTrainingService.trainWithExamples(request);
        return ResponseEntity.ok(response);
    }

    // Endpoint để xem dữ liệu training
    @GetMapping("/training/data")
    public ResponseEntity<String> getTrainingData() {
        String trainingData = aiTrainingService.generateTrainingPrompt();
        return ResponseEntity.ok(trainingData);
    }

    // Endpoint để cập nhật training
    @PostMapping("/training/update")
    public ResponseEntity<String> updateTraining() {
        aiTrainingService.updateTrainingExamples();
        return ResponseEntity.ok("Training data updated successfully");
    }

    @GetMapping("/gemini/test")
    public ResponseEntity<String> test() {
        return ResponseEntity.ok("Gemini API controller is working!");
    }

    // Endpoint để xóa session chat
    @DeleteMapping("/chatbot/session/{sessionId}")
    public ResponseEntity<String> clearChatSession(@PathVariable String sessionId) {
        chatSessionService.clearSession(sessionId);
        return ResponseEntity.ok("Session cleared successfully");
    }

    // Endpoint để lấy lịch sử chat
    @GetMapping("/chatbot/session/{sessionId}/history")
    public ResponseEntity<List<String>> getChatHistory(@PathVariable String sessionId) {
        List<String> history = chatSessionService.getSessionHistory(sessionId);
        return ResponseEntity.ok(history);
    }

    // Endpoint để xóa session chat theo userId
    @DeleteMapping("/chatbot/user/{userId}/session")
    public ResponseEntity<String> clearUserChatSession(@PathVariable Long userId) {
        chatSessionService.clearUserSession(userId);
        return ResponseEntity.ok("User session cleared successfully");
    }

    // Endpoint để lấy lịch sử chat theo userId
    @GetMapping("/chatbot/user/{userId}/history")
    public ResponseEntity<List<String>> getUserChatHistory(@PathVariable Long userId,
                                                          @RequestParam(defaultValue = "20") int maxMessages) {
        List<String> history = chatSessionService.getUserChatHistory(userId, maxMessages);
        return ResponseEntity.ok(history);
    }

    // Endpoint để lấy sessionId hiện tại của user
    @GetMapping("/chatbot/user/{userId}/session")
    public ResponseEntity<String> getUserSession(@PathVariable Long userId) {
        String sessionId = chatSessionService.getOrCreateSessionForUser(userId);
        return ResponseEntity.ok(sessionId);
    }

    // Endpoint chatbot với userId (recommended)
    @PostMapping("/chatbot/user/ask")
    public ResponseEntity<GeminiResponse> askChatbotWithUser(@RequestBody GeminiRequest request) {
        // Đảm bảo có userId trong request
        if (request.getUserId() == null) {
            return ResponseEntity.badRequest()
                    .body(GeminiResponse.builder()
                            .content("UserId is required")
                            .success(false)
                            .error("Missing userId")
                            .build());
        }

        GeminiResponse response = chatbotService.chatWithBookstore(request);
        return ResponseEntity.ok(response);
    }
}
