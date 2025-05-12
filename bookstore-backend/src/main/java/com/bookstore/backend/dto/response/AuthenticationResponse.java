package com.bookstore.backend.dto.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import com.fasterxml.jackson.annotation.JsonInclude;
@Getter
@Setter
@Builder

public class AuthenticationResponse {
    @JsonInclude(JsonInclude.Include.NON_NULL)
    String accessToken;
    String refreshToken ;
    boolean authenticated ;
}
