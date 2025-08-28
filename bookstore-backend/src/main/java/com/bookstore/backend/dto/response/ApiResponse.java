package com.bookstore.backend.dto.response;

import com.bookstore.backend.common.enums.ErrorCode;
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
    private String message ;
    private T data ;
    private ApiErrorResponse apiErrorResponse ;

    public ApiResponse (ErrorCode errorCode){
        this.apiErrorResponse = new ApiErrorResponse(errorCode) ;
    }

}
