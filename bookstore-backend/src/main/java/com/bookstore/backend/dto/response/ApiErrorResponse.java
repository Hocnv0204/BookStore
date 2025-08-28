package com.bookstore.backend.dto.response;

import com.bookstore.backend.common.enums.ErrorCode;
import org.springframework.http.HttpStatus;

public class ApiErrorResponse {
    private int code ;
    private String message ;
    private HttpStatus status ;

    public ApiErrorResponse(ErrorCode errorCode){
        this.code = errorCode.getCode() ;
        this.message = errorCode.getMessage() ;
        this.status = errorCode.getStatus() ;
    }
}
