package com.bookstore.backend.dto.request;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class UserUpdateRequest {
    private String fullName;
    private LocalDate dob;
    private String gender;
}
