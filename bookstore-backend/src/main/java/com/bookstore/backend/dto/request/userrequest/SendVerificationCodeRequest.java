package com.bookstore.backend.dto.request.userrequest;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class SendVerificationCodeRequest {
    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;
} 