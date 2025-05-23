package com.bookstore.backend.dto.request.userrequest;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;
import lombok.Data;
import java.time.LocalDate;

@Data
public class UserUpdateRequest {
    @NotBlank(message = "Username is required")
    @Size(min = 6, max = 32, message = "Username must be 6-32 characters")
    @Pattern(regexp = "^[A-Za-z0-9_]+$", message = "Username can only contain letters, numbers, and underscores")
    private String username;

    @NotBlank(message = "Full name is required")
    @Pattern(regexp = "^[\\p{L} ]+$", message = "Full name can only contain letters and spaces")
    private String fullName;

    @NotNull(message = "Date of birth is required")
    @Past(message = "Date of birth must be in the past")
    private LocalDate dob;

    @NotBlank(message = "Gender is required")
    @Pattern(regexp = "^(Nam|Nữ)$", message = "Gender must be Nam or Nữ")
    private String gender;
}
