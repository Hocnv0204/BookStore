package com.bookstore.backend.mapper;

import com.bookstore.backend.dto.NotificationDto;
import com.bookstore.backend.model.Notification;
import org.springframework.stereotype.Component;

@Component
public class NotificationMapper {

    public NotificationDto toDto(Notification notification) {
        if (notification == null) {
            return null;
        }

        return NotificationDto.builder()
                .id(notification.getId())
                .title(notification.getTitle())
                .message(notification.getMessage())
                .type(notification.getType())
                .status(notification.getStatus())
                .recipientType(notification.getRecipientType())
                .recipientUserId(notification.getRecipientUser() != null ? 
                    notification.getRecipientUser().getId() : null)
                .recipientUserName(notification.getRecipientUser() != null ? 
                    notification.getRecipientUser().getFullName() : null)
                .senderUserId(notification.getSenderUser() != null ? 
                    notification.getSenderUser().getId() : null)
                .senderUserName(notification.getSenderUser() != null ? 
                    notification.getSenderUser().getFullName() : null)
                .relatedOrderId(notification.getRelatedOrder() != null ? 
                    notification.getRelatedOrder().getId() : null)
                .metadata(notification.getMetadata())
                .createdAt(notification.getCreatedAt())
                .readAt(notification.getReadAt())
                .build();
    }

    public Notification toEntity(NotificationDto dto) {
        if (dto == null) {
            return null;
        }

        return Notification.builder()
                .id(dto.getId())
                .title(dto.getTitle())
                .message(dto.getMessage())
                .type(dto.getType())
                .status(dto.getStatus())
                .recipientType(dto.getRecipientType())
                .metadata(dto.getMetadata())
                .createdAt(dto.getCreatedAt())
                .readAt(dto.getReadAt())
                .build();
    }
}
