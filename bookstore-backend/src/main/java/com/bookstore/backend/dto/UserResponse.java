package com.bookstore.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDate;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor

public class UserResponse {
    private Long id;
    private String username;
    private String fullName;
    private String email;
    private LocalDate dob;
    private String gender;
    private Set<String> roles;
}
