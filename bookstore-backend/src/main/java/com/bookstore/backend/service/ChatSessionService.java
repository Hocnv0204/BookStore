package com.bookstore.backend.service;

import java.util.List;

public interface ChatSessionService {
    void saveMessage(String sessionId, String userMessage, String botResponse);
    void saveMessageWithUserId(Long userId, String userMessage, String botResponse);
    List<String> getSessionHistory(String sessionId);
    List<String> getUserChatHistory(Long userId, int maxMessages);
    void clearSession(String sessionId);
    void clearUserSession(Long userId);
    String buildContextFromHistory(String sessionId, int maxMessages);
    String buildContextFromUserHistory(Long userId, int maxMessages);
    String getOrCreateSessionForUser(Long userId);
}
