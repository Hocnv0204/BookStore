package com.bookstore.backend.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@RequiredArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiResponse<T> {
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private int code ;
    private String message ;
    private T result ;
}
