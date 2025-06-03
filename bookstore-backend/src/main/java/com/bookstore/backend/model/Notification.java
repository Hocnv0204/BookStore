package com.bookstore.backend.model;

import com.bookstore.backend.common.enums.NotificationType;
import com.bookstore.backend.common.enums.NotificationStatus;
import com.bookstore.backend.common.enums.RecipientType;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @Column(nullable = false, length = 200)
    String title;

    @Column(nullable = false, length = 1000)
    String message;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    NotificationType type;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    NotificationStatus status;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    RecipientType recipientType;

    // For USER notifications, this is the recipient user
    // For ADMIN notifications, this can be null (all admins) or specific admin
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recipient_user_id")
    User recipientUser;

    // User who created the notification (for custom notifications)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sender_user_id")
    User senderUser;

    // Related order for order-specific notifications
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id")
    Order relatedOrder;

    // Additional metadata (JSON format for flexibility)
    @Column(length = 500)
    String metadata;

    @Column(nullable = false)
    LocalDateTime createdAt;

    @Column
    LocalDateTime readAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (status == null) {
            status = NotificationStatus.UNREAD;
        }
    }
}
