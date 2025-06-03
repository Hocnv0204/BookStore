package com.bookstore.backend.dto;

import com.bookstore.backend.common.enums.NotificationStatus;
import com.bookstore.backend.common.enums.NotificationType;
import com.bookstore.backend.common.enums.RecipientType;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class NotificationDto {
    Long id;
    String title;
    String message;
    NotificationType type;
    NotificationStatus status;
    RecipientType recipientType;
    Long recipientUserId;
    String recipientUserName;
    Long senderUserId;
    String senderUserName;
    Long relatedOrderId;
    String metadata;
    LocalDateTime createdAt;
    LocalDateTime readAt;
}
