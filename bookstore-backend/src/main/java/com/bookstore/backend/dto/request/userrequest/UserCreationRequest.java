package com.bookstore.backend.dto.request.userrequest;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
@Getter
@Setter
public class UserCreationRequest {
    private String fullName ;
    private String email ;
    private LocalDate dob ;
    private String gender ;
    private String username ;
    private String password ;
}
