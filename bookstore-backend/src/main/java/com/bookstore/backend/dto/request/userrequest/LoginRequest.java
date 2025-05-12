package com.bookstore.backend.dto.request.userrequest;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LoginRequest {
    private String username ;
    private String password ;
}
