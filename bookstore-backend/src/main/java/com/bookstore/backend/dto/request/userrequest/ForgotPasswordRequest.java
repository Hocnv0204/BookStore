package com.bookstore.backend.dto.request.userrequest;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ForgotPasswordRequest {
    private String email;
} 