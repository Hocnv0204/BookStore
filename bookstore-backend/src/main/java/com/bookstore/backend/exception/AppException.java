package com.bookstore.backend.exception;

import com.bookstore.backend.common.enums.ErrorCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class AppException extends RuntimeException {
    private ErrorCode errorCode ;
    public AppException (ErrorCode errorCode){
        super(errorCode.getMessage()) ;
        this.errorCode = errorCode ;
    }
}
