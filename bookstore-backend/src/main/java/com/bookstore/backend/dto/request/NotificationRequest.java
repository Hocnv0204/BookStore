package com.bookstore.backend.dto.request;

import com.bookstore.backend.common.enums.NotificationType;
import com.bookstore.backend.common.enums.RecipientType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class NotificationRequest {
    
    @NotBlank(message = "Title is required")
    @Size(max = 200, message = "Title must not exceed 200 characters")
    String title;

    @NotBlank(message = "Message is required")
    @Size(max = 1000, message = "Message must not exceed 1000 characters")
    String message;

    @NotNull(message = "Notification type is required")
    NotificationType type;

    @NotNull(message = "Recipient type is required")
    RecipientType recipientType;

    // For SPECIFIC_USER notifications
    Long recipientUserId;

    // For order-related notifications
    Long relatedOrderId;

    // Additional metadata in JSON format
    String metadata;
}
