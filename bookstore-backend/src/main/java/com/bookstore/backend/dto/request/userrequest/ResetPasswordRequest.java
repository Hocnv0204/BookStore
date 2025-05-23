package com.bookstore.backend.dto.request.userrequest;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class ResetPasswordRequest {
    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Verification code is required")
    private String verificationCode;

    @NotBlank(message = "New password is required")
    @Size(min = 8, max = 32, message = "New password must be 8-32 characters")
    @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,32}$", message = "Password must contain lowercase, uppercase, and special character")
    private String newPassword;

    @NotBlank(message = "Confirm password is required")
    private String confirmPassword;
} 