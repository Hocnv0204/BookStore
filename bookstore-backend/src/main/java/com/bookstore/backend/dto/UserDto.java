package com.bookstore.backend.dto;

import lombok.*;

import java.time.LocalDate;
import java.util.Set;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDto {
    private Long id ;
    private String fullName ;
    private String email ;
    private LocalDate dob ;
    private String gender ;
    private String username ;
    private Set<String> roles ;
}
