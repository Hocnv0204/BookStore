package com.bookstore.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@Builder
public class UserDto {
    private Long id ;
    private String fullName ;
    private String email ;
    private LocalDate dob ;
    private String gender ;
    private String username ;
    private String password ;
}
