package com.bookstore.backend.common.enums;

public enum NotificationType {
    // User notifications
    ORDER_SUCCESS,
    PAYMENT_SUCCESS, 
    ORDER_CANCELLED,
    ORDER_DELIVERED,
    ORDER_CONFIRMED,
    ORDER_SHIPPED,
    PAYMENT_FAILED,
    CUSTOM_USER,
    
    // Admin notifications
    NEW_ORDER,
    NEW_USER_REGISTERED,
    ORDER_PAYMENT_RECEIVED,
    CUSTOM_ADMIN,
    SYSTEM_ALERT
}
