package com.bookstore.backend.dto.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Builder
@Getter
@Setter
public class IntrospectResponse {
    boolean valid ;
}
