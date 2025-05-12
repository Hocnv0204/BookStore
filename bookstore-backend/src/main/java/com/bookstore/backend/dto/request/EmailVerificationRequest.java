package com.bookstore.backend.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class EmailVerificationRequest {
    private String token;
} 