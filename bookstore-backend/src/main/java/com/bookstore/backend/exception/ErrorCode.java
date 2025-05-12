package com.bookstore.backend.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public enum ErrorCode {

    UNCATEGORIZED_EXCEPTION(9999, "Uncategorized error", HttpStatus.INTERNAL_SERVER_ERROR),
    // ===== CLIENT ERRORS (4xx) =====
    INVALID_REQUEST(400, "Invalid request", HttpStatus.BAD_REQUEST),
    UNAUTHORIZED(1003, "Unauthorized", HttpStatus.UNAUTHORIZED),
    FORBIDDEN(403, "Access denied", HttpStatus.FORBIDDEN),
    RESOURCE_NOT_FOUND(404, "Resource not found", HttpStatus.NOT_FOUND),
    // ===== DOMAIN-SPECIFIC ERRORS =====
    USER_NOT_FOUND(1000, "User not found", HttpStatus.NOT_FOUND),
    USER_EXISTS(1001, "User already exists", HttpStatus.BAD_REQUEST),
    BOOK_NOT_FOUND(1002, "Book not found", HttpStatus.NOT_FOUND),
    AUTHOR_NOT_FOUND(1003, "Author not found", HttpStatus.NOT_FOUND),
    CATEGORY_NOT_FOUND(1004, "Category not found", HttpStatus.NOT_FOUND),
    CATEGORY_ALREADY_EXISTS(1005, "Category already exists", HttpStatus.BAD_REQUEST),
    BOOK_ALREADY_EXISTS(1006, "Book already exists", HttpStatus.BAD_REQUEST),
    AUTHOR_ALREADY_EXISTS(1007, "Author already exists", HttpStatus.BAD_REQUEST),
    OUT_OF_STOCK(1008, "Book is out of stock", HttpStatus.CONFLICT),
    INVALID_QUANTITY(1009, "Invalid quantity", HttpStatus.BAD_REQUEST),
    CART_EMPTY(1010, "Shopping cart is empty", HttpStatus.BAD_REQUEST),
    ORDER_NOT_FOUND(1011, "Order not found", HttpStatus.NOT_FOUND),
    ORDER_CREATION_FAILED(1012, "Failed to create order", HttpStatus.INTERNAL_SERVER_ERROR),
    PAYMENT_FAILED(1013, "Payment failed", HttpStatus.PAYMENT_REQUIRED),
    PAYMENT_GATEWAY_ERROR(1014, "Payment gateway error", HttpStatus.SERVICE_UNAVAILABLE),
    EMAIL_EXISTS(1015, "Email already exists", HttpStatus.BAD_REQUEST),
    PASSWORD_MISMATCH(1016, "Passwords do not match", HttpStatus.BAD_REQUEST),
    INVALID_TOKEN(1017, "Invalid token", HttpStatus.BAD_REQUEST),
    TOKEN_EXPIRED(1018, "Token has expired", HttpStatus.BAD_REQUEST),
    EMAIL_ALREADY_VERIFIED(1019, "Email is already verified", HttpStatus.BAD_REQUEST),
    EMAIL_SENDING_FAILED(1020, "Failed to send email", HttpStatus.INTERNAL_SERVER_ERROR),
    REVIEW_NOT_FOUND(1021, "Review not found", HttpStatus.NOT_FOUND),
    REVIEW_ALREADY_EXISTS(1022, "User has already reviewed this book", HttpStatus.BAD_REQUEST),
    CART_IS_EMPTY(1023, "Cart is empty", HttpStatus.BAD_REQUEST);

    private final int code;
    private final String message;
    private final HttpStatus status;

    ErrorCode(int code, String message, HttpStatus status) {
        this.code = code;
        this.message = message;
        this.status = status;
    }
}
