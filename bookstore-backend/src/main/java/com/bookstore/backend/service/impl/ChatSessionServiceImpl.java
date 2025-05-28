package com.bookstore.backend.service.impl;

import com.bookstore.backend.service.ChatSessionService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Service
@Slf4j
public class ChatSessionServiceImpl implements ChatSessionService {

    // Map để lưu trữ session theo sessionId
    private final Map<String, List<String>> sessionHistory = new ConcurrentHashMap<>();
    
    // Map để lưu trữ session theo userId
    private final Map<Long, List<String>> userChatHistory = new ConcurrentHashMap<>();
    
    // Map để liên kết userId với sessionId hiện tại
    private final Map<Long, String> userSessionMap = new ConcurrentHashMap<>();

    @Override
    public void saveMessage(String sessionId, String userMessage, String botResponse) {
        if (sessionId == null || sessionId.isEmpty()) {
            return;
        }
        
        List<String> history = sessionHistory.computeIfAbsent(sessionId, k -> new ArrayList<>());
        
        // Thêm tin nhắn mới
        history.add(formatMessage("User", userMessage));
        history.add(formatMessage("Bot", botResponse));
        
        log.debug("Saved message to session {}: {} messages", sessionId, history.size());
    }

    @Override
    public void saveMessageWithUserId(Long userId, String userMessage, String botResponse) {
        // Lưu vào user chat history
        userChatHistory.computeIfAbsent(userId, k -> new ArrayList<>())
                .add(formatMessage("User", userMessage));
        userChatHistory.get(userId)
                .add(formatMessage("Bot", botResponse));
        
        // Cũng lưu vào session history nếu có sessionId
        String sessionId = userSessionMap.get(userId);
        if (sessionId != null) {
            saveMessage(sessionId, userMessage, botResponse);
        }
        
        log.info("Saved message for userId: {}", userId);
    }

    @Override
    public List<String> getSessionHistory(String sessionId) {
        if (sessionId == null || sessionId.isEmpty()) {
            return new ArrayList<>();
        }
        return sessionHistory.getOrDefault(sessionId, new ArrayList<>());
    }

    @Override
    public List<String> getUserChatHistory(Long userId, int maxMessages) {
        List<String> history = userChatHistory.getOrDefault(userId, new ArrayList<>());
        int startIndex = Math.max(0, history.size() - maxMessages);
        return history.subList(startIndex, history.size());
    }

    @Override
    public void clearSession(String sessionId) {
        if (sessionId != null && !sessionId.isEmpty()) {
            sessionHistory.remove(sessionId);
            log.info("Cleared session: {}", sessionId);
        }
    }

    @Override
    public void clearUserSession(Long userId) {
        userChatHistory.remove(userId);
        userSessionMap.remove(userId);
        log.info("Cleared user session for userId: {}", userId);
    }

    @Override
    public String buildContextFromHistory(String sessionId, int maxMessages) {
        List<String> history = getSessionHistory(sessionId);
        return buildContextFromMessages(history, maxMessages);
    }

    @Override
    public String buildContextFromUserHistory(Long userId, int maxMessages) {
        List<String> history = getUserChatHistory(userId, maxMessages);
        return buildContextFromMessages(history, maxMessages);
    }

    @Override
    public String getOrCreateSessionForUser(Long userId) {
        // Kiểm tra xem user đã có session chưa
        String existingSessionId = userSessionMap.get(userId);
        if (existingSessionId != null) {
            return existingSessionId;
        }
        
        // Tạo session mới cho user
        String newSessionId = "user_" + userId + "_" + System.currentTimeMillis();
        userSessionMap.put(userId, newSessionId);
        
        log.info("Created new session {} for userId: {}", newSessionId, userId);
        return newSessionId;
    }

    private String buildContextFromMessages(List<String> messages, int maxMessages) {
        if (messages.isEmpty()) {
            return "";
        }
        
        StringBuilder context = new StringBuilder();
        int startIndex = Math.max(0, messages.size() - maxMessages);
        
        for (int i = startIndex; i < messages.size(); i++) {
            context.append(messages.get(i)).append("\n");
        }
        
        return context.toString();
    }

    private String formatMessage(String sender, String message) {
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("HH:mm:ss"));
        return String.format("[%s] %s: %s", timestamp, sender, message);
    }
}
