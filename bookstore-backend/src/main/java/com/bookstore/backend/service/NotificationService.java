package com.bookstore.backend.service;

import com.bookstore.backend.common.enums.NotificationStatus;
import com.bookstore.backend.common.enums.NotificationType;
import com.bookstore.backend.dto.NotificationDto;
import com.bookstore.backend.dto.request.NotificationRequest;
import com.bookstore.backend.dto.response.NotificationStatsResponse;
import com.bookstore.backend.dto.response.PageResponse;
import com.bookstore.backend.model.Order;
import com.bookstore.backend.model.User;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface NotificationService {
    
    // User notification methods
    PageResponse<NotificationDto> getUserNotifications(Pageable pageable);
    PageResponse<NotificationDto> getUserNotificationsByStatus(NotificationStatus status, Pageable pageable);
    PageResponse<NotificationDto> searchUserNotifications(String search, NotificationType type, NotificationStatus status, Pageable pageable);
    NotificationStatsResponse getUserNotificationStats();
    Long getUnreadUserNotificationCount();
    
    // Admin notification methods
    PageResponse<NotificationDto> getAdminNotifications(Pageable pageable);
    PageResponse<NotificationDto> getAdminNotificationsByStatus(NotificationStatus status, Pageable pageable);
    PageResponse<NotificationDto> searchAdminNotifications(String search, NotificationType type, NotificationStatus status, Pageable pageable);
    NotificationStatsResponse getAdminNotificationStats();
    Long getUnreadAdminNotificationCount();
    
    // Common notification actions
    NotificationDto markNotificationAsRead(Long notificationId);
    void markAllNotificationsAsRead();
    void deleteNotification(Long notificationId);
    void deleteAllReadNotifications();
    NotificationDto getNotificationById(Long notificationId);
    
    // Custom notification creation (Admin only)
    NotificationDto createCustomNotification(NotificationRequest request);
    
    // Automatic notification triggers
    void createOrderSuccessNotification(Order order);
    void createPaymentSuccessNotification(Order order);
    void createOrderCancelledNotification(Order order);
    void createOrderStatusChangeNotification(Order order);
    void createPaymentFailedNotification(Order order);
    
    // Admin automatic notifications
    void createNewOrderNotification(Order order);
    void createNewUserRegistrationNotification(User user);
    void createPaymentReceivedNotification(Order order);
    
    // Bulk operations
    void markMultipleNotificationsAsRead(List<Long> notificationIds);
    void deleteMultipleNotifications(List<Long> notificationIds);
    
    // System maintenance
    void cleanupOldNotifications(int daysOld);
}
