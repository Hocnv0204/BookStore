package com.bookstore.backend.dto.request.userrequest;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ChangePasswordRequest {
    @NotBlank(message = "Current password is required")
    private String currentPassword;

    @NotBlank(message = "New password is required")
    @Size(min = 8, max = 32, message = "New password must be 8-32 characters")
    @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,32}$", message = "Password must contain lowercase, uppercase, and special character")
    private String newPassword;

    @NotBlank(message = "Confirm password is required")
    private String confirmPassword;
} 