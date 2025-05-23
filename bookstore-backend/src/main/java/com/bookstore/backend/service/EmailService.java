package com.bookstore.backend.service;

public interface EmailService {
    void sendVerificationEmail(String to, String verificationCode);
    void sendPasswordResetEmail(String to, String resetCode);
} 