package com.bookstore.backend.service.impl;

import com.bookstore.backend.common.enums.*;
import com.bookstore.backend.dto.NotificationDto;
import com.bookstore.backend.dto.request.NotificationRequest;
import com.bookstore.backend.dto.response.NotificationStatsResponse;
import com.bookstore.backend.dto.response.PageResponse;
import com.bookstore.backend.exception.AppException;
import com.bookstore.backend.mapper.NotificationMapper;
import com.bookstore.backend.model.Notification;
import com.bookstore.backend.model.Order;
import com.bookstore.backend.model.User;
import com.bookstore.backend.repository.NotificationRepository;
import com.bookstore.backend.repository.UserRepository;
import com.bookstore.backend.repository.OrderRepository;
import com.bookstore.backend.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;
    private final OrderRepository orderRepository;
    private final NotificationMapper notificationMapper;

    private String getCurrentUsername() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication.getName();
    }

    private User getCurrentUser() {
        String username = getCurrentUsername();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
    }

    private boolean isAdmin() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
    }

    private PageResponse<NotificationDto> createPageResponse(Page<Notification> notificationPage) {
        return PageResponse.<NotificationDto>builder()
                .content(notificationPage.getContent().stream()
                        .map(notificationMapper::toDto)
                        .collect(Collectors.toList()))
                .totalElements(notificationPage.getTotalElements())
                .totalPages(notificationPage.getTotalPages())
                .pageNumber(notificationPage.getNumber())
                .pageSize(notificationPage.getSize())
                .isLast(notificationPage.isLast())
                .build();
    }

    // User notification methods
    @Override
    @Transactional(readOnly = true)
    public PageResponse<NotificationDto> getUserNotifications(Pageable pageable) {
        User currentUser = getCurrentUser();
        Page<Notification> notifications = notificationRepository
                .findUserNotifications(currentUser.getId(), pageable);
        return createPageResponse(notifications);
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<NotificationDto> getUserNotificationsByStatus(NotificationStatus status, Pageable pageable) {
        User currentUser = getCurrentUser();
        Page<Notification> notifications = notificationRepository
                .findUserNotificationsByStatus(currentUser.getId(), status, pageable);
        return createPageResponse(notifications);
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<NotificationDto> searchUserNotifications(String search, NotificationType type, 
                                                                NotificationStatus status, Pageable pageable) {
        User currentUser = getCurrentUser();
        Page<Notification> notifications = notificationRepository
                .searchUserNotifications(currentUser.getId(), type, status, search, pageable);
        return createPageResponse(notifications);
    }

    @Override
    @Transactional(readOnly = true)
    public NotificationStatsResponse getUserNotificationStats() {
        User currentUser = getCurrentUser();
        Long unreadCount = notificationRepository.countUnreadUserNotifications(currentUser.getId());
        
        // Additional stats can be implemented here
        return NotificationStatsResponse.builder()
                .unreadNotifications(unreadCount)
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public Long getUnreadUserNotificationCount() {
        User currentUser = getCurrentUser();
        return notificationRepository.countUnreadUserNotifications(currentUser.getId());
    }

    // Admin notification methods
    @Override
    @Transactional(readOnly = true)
    public PageResponse<NotificationDto> getAdminNotifications(Pageable pageable) {
        if (!isAdmin()) {
            throw new AppException(ErrorCode.FORBIDDEN);
        }
        User currentUser = getCurrentUser();
        Page<Notification> notifications = notificationRepository
                .findAdminNotifications(currentUser.getId(), pageable);
        return createPageResponse(notifications);
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<NotificationDto> getAdminNotificationsByStatus(NotificationStatus status, Pageable pageable) {
        if (!isAdmin()) {
            throw new AppException(ErrorCode.FORBIDDEN);
        }
        User currentUser = getCurrentUser();
        Page<Notification> notifications = notificationRepository
                .findAdminNotificationsByStatus(currentUser.getId(), status, pageable);
        return createPageResponse(notifications);
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<NotificationDto> searchAdminNotifications(String search, NotificationType type, 
                                                                 NotificationStatus status, Pageable pageable) {
        if (!isAdmin()) {
            throw new AppException(ErrorCode.FORBIDDEN);
        }
        User currentUser = getCurrentUser();
        Page<Notification> notifications = notificationRepository
                .searchAdminNotifications(currentUser.getId(), type, status, search, pageable);
        return createPageResponse(notifications);
    }

    @Override
    @Transactional(readOnly = true)
    public NotificationStatsResponse getAdminNotificationStats() {
        if (!isAdmin()) {
            throw new AppException(ErrorCode.FORBIDDEN);
        }
        User currentUser = getCurrentUser();
        Long unreadCount = notificationRepository.countUnreadAdminNotifications(currentUser.getId());
        
        return NotificationStatsResponse.builder()
                .unreadNotifications(unreadCount)
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public Long getUnreadAdminNotificationCount() {
        if (!isAdmin()) {
            throw new AppException(ErrorCode.FORBIDDEN);
        }
        User currentUser = getCurrentUser();
        return notificationRepository.countUnreadAdminNotifications(currentUser.getId());
    }

    // Common notification actions
    @Override
    public NotificationDto markNotificationAsRead(Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new AppException(ErrorCode.NOTIFICATION_NOT_FOUND));
        
        User currentUser = getCurrentUser();
        
        // Verify user has access to this notification
        boolean hasAccess = false;
        if (notification.getRecipientType() == RecipientType.USER && 
            notification.getRecipientUser() != null && 
            notification.getRecipientUser().getId().equals(currentUser.getId())) {
            hasAccess = true;
        } else if (notification.getRecipientType() == RecipientType.ALL_USERS) {
            hasAccess = true;
        } else if (isAdmin() && (notification.getRecipientType() == RecipientType.ADMIN || 
                                notification.getRecipientType() == RecipientType.ALL_ADMINS)) {
            hasAccess = true;
        }
        
        if (!hasAccess) {
            throw new AppException(ErrorCode.FORBIDDEN);
        }
        
        notification.setStatus(NotificationStatus.READ);
        notification.setReadAt(LocalDateTime.now());
        
        return notificationMapper.toDto(notificationRepository.save(notification));
    }

    @Override
    public void markAllNotificationsAsRead() {
        User currentUser = getCurrentUser();
        LocalDateTime now = LocalDateTime.now();
        
        if (isAdmin()) {
            notificationRepository.markAllAdminNotificationsAsRead(currentUser.getId(), now);
        } else {
            notificationRepository.markAllUserNotificationsAsRead(currentUser.getId(), now);
        }
    }

    @Override
    public void deleteNotification(Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new AppException(ErrorCode.NOTIFICATION_NOT_FOUND));
        
        User currentUser = getCurrentUser();
        
        // Verify user has access to this notification
        boolean hasAccess = false;
        if (notification.getRecipientType() == RecipientType.USER && 
            notification.getRecipientUser() != null && 
            notification.getRecipientUser().getId().equals(currentUser.getId())) {
            hasAccess = true;
        } else if (notification.getRecipientType() == RecipientType.ALL_USERS) {
            hasAccess = true;
        } else if (isAdmin() && (notification.getRecipientType() == RecipientType.ADMIN || 
                                notification.getRecipientType() == RecipientType.ALL_ADMINS)) {
            hasAccess = true;
        }
        
        if (!hasAccess) {
            throw new AppException(ErrorCode.FORBIDDEN);
        }
        
        notificationRepository.delete(notification);
    }

    @Override
    public void deleteAllReadNotifications() {
        // This would require a custom query to delete only read notifications for the current user
        // Implementation depends on specific requirements
        log.info("Delete all read notifications requested by user: {}", getCurrentUsername());
    }

    @Override
    @Transactional(readOnly = true)
    public NotificationDto getNotificationById(Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new AppException(ErrorCode.NOTIFICATION_NOT_FOUND));
        
        User currentUser = getCurrentUser();
        
        // Verify user has access to this notification
        boolean hasAccess = false;
        if (notification.getRecipientType() == RecipientType.USER && 
            notification.getRecipientUser() != null && 
            notification.getRecipientUser().getId().equals(currentUser.getId())) {
            hasAccess = true;
        } else if (notification.getRecipientType() == RecipientType.ALL_USERS) {
            hasAccess = true;
        } else if (isAdmin() && (notification.getRecipientType() == RecipientType.ADMIN || 
                                notification.getRecipientType() == RecipientType.ALL_ADMINS)) {
            hasAccess = true;
        }
        
        if (!hasAccess) {
            throw new AppException(ErrorCode.FORBIDDEN);
        }
        
        return notificationMapper.toDto(notification);
    }

    // Custom notification creation (Admin only)
    @Override
    public NotificationDto createCustomNotification(NotificationRequest request) {
        if (!isAdmin()) {
            throw new AppException(ErrorCode.FORBIDDEN);
        }
        
        User currentUser = getCurrentUser();
        
        Notification.NotificationBuilder builder = Notification.builder()
                .title(request.getTitle())
                .message(request.getMessage())
                .type(request.getType())
                .recipientType(request.getRecipientType())
                .senderUser(currentUser)
                .metadata(request.getMetadata())
                .status(NotificationStatus.UNREAD);
        
        // Set recipient user if specified
        if (request.getRecipientUserId() != null) {
            User recipientUser = userRepository.findById(request.getRecipientUserId())
                    .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
            builder.recipientUser(recipientUser);
        }
        
        // Set related order if specified
        if (request.getRelatedOrderId() != null) {
            Order relatedOrder = orderRepository.findById(request.getRelatedOrderId())
                    .orElseThrow(() -> new AppException(ErrorCode.ORDER_NOT_FOUND));
            builder.relatedOrder(relatedOrder);
        }
        
        Notification notification = builder.build();
        notification = notificationRepository.save(notification);
        
        log.info("Custom notification created by admin: {} for recipient type: {}", 
                currentUser.getUsername(), request.getRecipientType());
        
        return notificationMapper.toDto(notification);
    }

    // Automatic notification triggers
    @Override
    public void createOrderSuccessNotification(Order order) {
        Notification notification = Notification.builder()
                .title("Order Created Successfully")
                .message(String.format("Your order #%d has been created successfully. Total amount: $%.2f", 
                        order.getId(), order.getTotalAmount()))
                .type(NotificationType.ORDER_SUCCESS)
                .recipientType(RecipientType.USER)
                .recipientUser(order.getUser())
                .relatedOrder(order)
                .status(NotificationStatus.UNREAD)
                .build();
        
        notificationRepository.save(notification);
        log.info("Order success notification created for user: {} and order: {}", 
                order.getUser().getUsername(), order.getId());
    }

    @Override
    public void createPaymentSuccessNotification(Order order) {
        Notification notification = Notification.builder()
                .title("Payment Successful")
                .message(String.format("Payment for order #%d has been processed successfully. Amount: $%.2f", 
                        order.getId(), order.getTotalAmount()))
                .type(NotificationType.PAYMENT_SUCCESS)
                .recipientType(RecipientType.USER)
                .recipientUser(order.getUser())
                .relatedOrder(order)
                .status(NotificationStatus.UNREAD)
                .build();
        
        notificationRepository.save(notification);
        log.info("Payment success notification created for user: {} and order: {}", 
                order.getUser().getUsername(), order.getId());
    }

    @Override
    public void createOrderCancelledNotification(Order order) {
        Notification notification = Notification.builder()
                .title("Order Cancelled")
                .message(String.format("Your order #%d has been cancelled. If you have any questions, please contact support.", 
                        order.getId()))
                .type(NotificationType.ORDER_CANCELLED)
                .recipientType(RecipientType.USER)
                .recipientUser(order.getUser())
                .relatedOrder(order)
                .status(NotificationStatus.UNREAD)
                .build();
        
        notificationRepository.save(notification);
        log.info("Order cancelled notification created for user: {} and order: {}", 
                order.getUser().getUsername(), order.getId());
    }

    @Override
    public void createOrderStatusChangeNotification(Order order) {
        String statusMessage = getStatusMessage(order.getStatus());
        NotificationType notificationType = getNotificationTypeFromOrderStatus(order.getStatus());
        
        Notification notification = Notification.builder()
                .title("Order Status Update")
                .message(String.format("Your order #%d status has been updated to: %s. %s", 
                        order.getId(), order.getStatus(), statusMessage))
                .type(notificationType)
                .recipientType(RecipientType.USER)
                .recipientUser(order.getUser())
                .relatedOrder(order)
                .status(NotificationStatus.UNREAD)
                .build();
        
        notificationRepository.save(notification);
        log.info("Order status change notification created for user: {} and order: {}", 
                order.getUser().getUsername(), order.getId());
    }

    @Override
    public void createPaymentFailedNotification(Order order) {
        Notification notification = Notification.builder()
                .title("Payment Failed")
                .message(String.format("Payment for order #%d has failed. Please try again or contact support.", 
                        order.getId()))
                .type(NotificationType.PAYMENT_FAILED)
                .recipientType(RecipientType.USER)
                .recipientUser(order.getUser())
                .relatedOrder(order)
                .status(NotificationStatus.UNREAD)
                .build();
        
        notificationRepository.save(notification);
        log.info("Payment failed notification created for user: {} and order: {}", 
                order.getUser().getUsername(), order.getId());
    }

    // Admin automatic notifications
    @Override
    public void createNewOrderNotification(Order order) {
        Notification notification = Notification.builder()
                .title("New Order Received")
                .message(String.format("New order #%d received from %s. Total amount: $%.2f", 
                        order.getId(), order.getUser().getFullName(), order.getTotalAmount()))
                .type(NotificationType.NEW_ORDER)
                .recipientType(RecipientType.ALL_ADMINS)
                .relatedOrder(order)
                .status(NotificationStatus.UNREAD)
                .build();
        
        notificationRepository.save(notification);
        log.info("New order notification created for admins for order: {}", order.getId());
    }

    @Override
    public void createNewUserRegistrationNotification(User user) {
        Notification notification = Notification.builder()
                .title("New User Registration")
                .message(String.format("New user registered: %s (%s)", 
                        user.getFullName(), user.getEmail()))
                .type(NotificationType.NEW_USER_REGISTERED)
                .recipientType(RecipientType.ALL_ADMINS)
                .status(NotificationStatus.UNREAD)
                .build();
        
        notificationRepository.save(notification);
        log.info("New user registration notification created for admins for user: {}", user.getUsername());
    }

    @Override
    public void createPaymentReceivedNotification(Order order) {
        Notification notification = Notification.builder()
                .title("Payment Received")
                .message(String.format("Payment received for order #%d from %s. Amount: $%.2f", 
                        order.getId(), order.getUser().getFullName(), order.getTotalAmount()))
                .type(NotificationType.ORDER_PAYMENT_RECEIVED)
                .recipientType(RecipientType.ALL_ADMINS)
                .relatedOrder(order)
                .status(NotificationStatus.UNREAD)
                .build();
        
        notificationRepository.save(notification);
        log.info("Payment received notification created for admins for order: {}", order.getId());
    }

    // Bulk operations
    @Override
    public void markMultipleNotificationsAsRead(List<Long> notificationIds) {
        User currentUser = getCurrentUser();
        LocalDateTime now = LocalDateTime.now();
        
        for (Long notificationId : notificationIds) {
            try {
                notificationRepository.markAsRead(notificationId, now);
            } catch (Exception e) {
                log.warn("Failed to mark notification {} as read for user {}", notificationId, currentUser.getUsername());
            }
        }
    }

    @Override
    public void deleteMultipleNotifications(List<Long> notificationIds) {
        for (Long notificationId : notificationIds) {
            try {
                deleteNotification(notificationId);
            } catch (Exception e) {
                log.warn("Failed to delete notification {}", notificationId);
            }
        }
    }

    // System maintenance
    @Override
    public void cleanupOldNotifications(int daysOld) {
        LocalDateTime cutoffDate = LocalDateTime.now().minusDays(daysOld);
        notificationRepository.deleteOldNotifications(cutoffDate);
        log.info("Cleaned up notifications older than {} days", daysOld);
    }

    // Helper methods
    private String getStatusMessage(OrderStatus status) {
        switch (status) {
            case PENDING:
                return "Your order is being processed.";
            case CONFIRM:
                return "Your order has been confirmed and will be prepared for shipping.";
            case SHIPPED:
                return "Your order has been shipped and is on its way to you.";
            case DELIVERED:
                return "Your order has been delivered successfully.";
            case CANCELLED:
                return "Your order has been cancelled.";
            default:
                return "Order status updated.";
        }
    }

    private NotificationType getNotificationTypeFromOrderStatus(OrderStatus status) {
        switch (status) {
            case CONFIRM:
                return NotificationType.ORDER_CONFIRMED;
            case SHIPPED:
                return NotificationType.ORDER_SHIPPED;
            case DELIVERED:
                return NotificationType.ORDER_DELIVERED;
            case CANCELLED:
                return NotificationType.ORDER_CANCELLED;
            default:
                return NotificationType.CUSTOM_USER;
        }
    }
}
