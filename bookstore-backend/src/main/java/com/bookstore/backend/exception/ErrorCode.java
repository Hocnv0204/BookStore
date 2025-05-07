package com.bookstore.backend.exception;

import lombok.AllArgsConstructor;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
@AllArgsConstructor

public enum ErrorCode {

    UNCATEGORIZED_EXCEPTION(405 , "Uncategorized Exception" , HttpStatus.INTERNAL_SERVER_ERROR),
    // ===== CLIENT ERRORS (4xx) =====
    INVALID_REQUEST(400, "Invalid request", HttpStatus.BAD_REQUEST),
    UNAUTHORIZED(401, "Authentication missing or invalid token", HttpStatus.UNAUTHORIZED),
    FORBIDDEN(403, "Access denied", HttpStatus.FORBIDDEN),
    RESOURCE_NOT_FOUND(404, "Resource not found", HttpStatus.NOT_FOUND),
    // ===== DOMAIN-SPECIFIC ERRORS =====
    USER_NOT_FOUND(1001, "User does not exist", HttpStatus.NOT_FOUND),
    USER_EXISTS(1005 , "User already exists" , HttpStatus.BAD_REQUEST),
    BOOK_NOT_FOUND(1002, "Book not found", HttpStatus.NOT_FOUND),
    OUT_OF_STOCK(1003, "Book is out of stock", HttpStatus.CONFLICT),
    INVALID_QUANTITY(1004, "Invalid quantity", HttpStatus.BAD_REQUEST),
    CART_EMPTY(1005, "Shopping cart is empty", HttpStatus.BAD_REQUEST),
    ORDER_NOT_FOUND(2001, "Order not found", HttpStatus.NOT_FOUND),
    ORDER_CREATION_FAILED(2002, "Failed to create order", HttpStatus.INTERNAL_SERVER_ERROR),
    PAYMENT_FAILED(3001, "Payment failed", HttpStatus.PAYMENT_REQUIRED),
    PAYMENT_GATEWAY_ERROR(3002, "Payment gateway error", HttpStatus.SERVICE_UNAVAILABLE);
    ;
    private int code ;
    private String message ;
    private HttpStatus httpStatus ;
}
