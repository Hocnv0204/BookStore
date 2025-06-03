package com.bookstore.backend.common.enums;

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
    INVALID_PASSWORD(1006, "Invalid current password", HttpStatus.BAD_REQUEST),
    PASSWORD_MISMATCH(1007, "New password and confirm password do not match", HttpStatus.BAD_REQUEST),
    INVALID_TOKEN(1017, "Invalid token", HttpStatus.BAD_REQUEST),
    TOKEN_EXPIRED(1018, "Token has expired", HttpStatus.BAD_REQUEST),
    EMAIL_ALREADY_VERIFIED(1019, "Email is already verified", HttpStatus.BAD_REQUEST),
    EMAIL_SENDING_FAILED(1020, "Failed to send email", HttpStatus.INTERNAL_SERVER_ERROR),
    REVIEW_NOT_FOUND(1021, "Review not found", HttpStatus.NOT_FOUND),
    REVIEW_ALREADY_EXISTS(1022, "User has already reviewed this book", HttpStatus.BAD_REQUEST),
    CART_IS_EMPTY(1023, "Cart is empty", HttpStatus.BAD_REQUEST),
    ORDER_CANNOT_BE_UPDATED(1025, "Order cannot be updated in its current state", HttpStatus.BAD_REQUEST),
    ORDER_CANNOT_BE_CANCELLED(1026, "Order cannot be cancelled in its current state", HttpStatus.BAD_REQUEST),
    FILE_EMPTY(1027, "File is empty", HttpStatus.BAD_REQUEST),
    FILE_TOO_LARGE(1028, "File size exceeds maximum limit", HttpStatus.BAD_REQUEST),
    INVALID_FILE_TYPE(1029, "Invalid file type", HttpStatus.BAD_REQUEST),
    FILE_STORAGE_ERROR(1030, "Failed to store file", HttpStatus.INTERNAL_SERVER_ERROR),
    FILE_DELETION_ERROR(1031, "Failed to delete file", HttpStatus.INTERNAL_SERVER_ERROR),
    INVALID_YEAR(1032, "Invalid year. Year must be between 2000 and current year", HttpStatus.BAD_REQUEST),
    INVALID_MONTH(1033, "Invalid month. Month must be between 1 and 12", HttpStatus.BAD_REQUEST),
    REVIEW_NOT_ALLOWED(1034, "You can only review books that you have purchased", HttpStatus.FORBIDDEN),
    PUBLISHER_NOT_FOUND(404, "Publisher not found"),
    DISTRIBUTOR_NOT_FOUND(404, "Distributor not found"),
    DISTRIBUTOR_NAME_EXISTED(404, "Distributor name already exists"),
    DISTRIBUTOR_EMAIL_EXISTED(404, "Distributor email already exists"),
    PUBLISHER_NAME_EXISTED(404, "Publisher name already exists"),
    PUBLISHER_EMAIL_EXISTED(404, "Publisher email already exists"),
    INVALID_ORDER_STATUS(404, "Status not found"),
    NOTIFICATION_NOT_FOUND(1035, "Notification not found", HttpStatus.NOT_FOUND),
    NOTIFICATION_ACCESS_DENIED(1036, "Access denied to notification", HttpStatus.FORBIDDEN),
    INVALID_NOTIFICATION_TYPE(1037, "Invalid notification type", HttpStatus.BAD_REQUEST),
    
    // Coupon/Discount errors
    COUPON_NOT_FOUND(1038, "Coupon not found", HttpStatus.NOT_FOUND),
    COUPON_CODE_EXISTS(1039, "Coupon code already exists", HttpStatus.BAD_REQUEST),
    COUPON_EXPIRED(1040, "Coupon has expired", HttpStatus.BAD_REQUEST),
    COUPON_INACTIVE(1041, "Coupon is not active", HttpStatus.BAD_REQUEST),
    COUPON_USAGE_LIMIT_EXCEEDED(1042, "Coupon usage limit exceeded", HttpStatus.BAD_REQUEST),
    COUPON_USER_LIMIT_EXCEEDED(1043, "User has exceeded the usage limit for this coupon", HttpStatus.BAD_REQUEST),
    COUPON_MINIMUM_ORDER_NOT_MET(1044, "Order amount does not meet minimum requirement for this coupon", HttpStatus.BAD_REQUEST),
    INVALID_COUPON_DATES(1045, "End date must be after start date", HttpStatus.BAD_REQUEST),
    COUPON_ALREADY_APPLIED(1046, "A coupon has already been applied to this order", HttpStatus.BAD_REQUEST),
    ORDER_CANNOT_BE_MODIFIED(1047, "Order cannot be modified in its current status", HttpStatus.BAD_REQUEST),
    NO_COUPON_APPLIED(1048, "No coupon is applied to this order", HttpStatus.BAD_REQUEST);

    private final int code;
    private final String message;
    private final HttpStatus status;

    ErrorCode(int code, String message, HttpStatus status) {
        this.code = code;
        this.message = message;
        this.status = status;
    }

    ErrorCode(int code, String message) {
        this.code = code;
        this.message = message;
        this.status = HttpStatus.NOT_FOUND;
    }
}
