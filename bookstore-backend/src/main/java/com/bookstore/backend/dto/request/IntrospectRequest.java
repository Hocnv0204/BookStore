package com.bookstore.backend.dto.request;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Builder
@Getter
@Setter

public class IntrospectRequest {
    private String token ;
}
