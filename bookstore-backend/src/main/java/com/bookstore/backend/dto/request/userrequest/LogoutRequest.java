package com.bookstore.backend.dto.request.userrequest;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LogoutRequest {
    private String token ;
}
