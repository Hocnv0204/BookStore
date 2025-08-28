package com.bookstore.backend.repository;

import com.bookstore.backend.common.enums.NotificationStatus;
import com.bookstore.backend.common.enums.NotificationType;
import com.bookstore.backend.common.enums.RecipientType;
import com.bookstore.backend.model.Notification;
import com.bookstore.backend.model.Order;
import com.bookstore.backend.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    
    // User notifications
    @Query("SELECT n FROM Notification n WHERE " +
           "(n.recipientType = 'USER' AND n.recipientUser.id = :userId) OR " +
           "(n.recipientType = 'ALL_USERS') " +
           "ORDER BY n.createdAt DESC")
    Page<Notification> findUserNotifications(@Param("userId") Long userId, Pageable pageable);

    @Query("SELECT n FROM Notification n WHERE " +
           "((n.recipientType = 'USER' AND n.recipientUser.id = :userId) OR " +
           "(n.recipientType = 'ALL_USERS')) AND " +
           "n.status = :status " +
           "ORDER BY n.createdAt DESC")
    Page<Notification> findUserNotificationsByStatus(@Param("userId") Long userId, 
                                                     @Param("status") NotificationStatus status, 
                                                     Pageable pageable);

    // Admin notifications
    @Query("SELECT n FROM Notification n WHERE " +
           "(n.recipientType = 'ADMIN' AND (n.recipientUser IS NULL OR n.recipientUser.id = :adminId)) OR " +
           "(n.recipientType = 'ALL_ADMINS') " +
           "ORDER BY n.createdAt DESC")
    Page<Notification> findAdminNotifications(@Param("adminId") Long adminId, Pageable pageable);

    @Query("SELECT n FROM Notification n WHERE " +
           "((n.recipientType = 'ADMIN' AND (n.recipientUser IS NULL OR n.recipientUser.id = :adminId)) OR " +
           "(n.recipientType = 'ALL_ADMINS')) AND " +
           "n.status = :status " +
           "ORDER BY n.createdAt DESC")
    Page<Notification> findAdminNotificationsByStatus(@Param("adminId") Long adminId, 
                                                      @Param("status") NotificationStatus status, 
                                                      Pageable pageable);

    // Count unread notifications
    @Query("SELECT COUNT(n) FROM Notification n WHERE " +
           "((n.recipientType = 'USER' AND n.recipientUser.id = :userId) OR " +
           "(n.recipientType = 'ALL_USERS')) AND " +
           "n.status = 'UNREAD'")
    Long countUnreadUserNotifications(@Param("userId") Long userId);

    @Query("SELECT COUNT(n) FROM Notification n WHERE " +
           "((n.recipientType = 'ADMIN' AND (n.recipientUser IS NULL OR n.recipientUser.id = :adminId)) OR " +
           "(n.recipientType = 'ALL_ADMINS')) AND " +
           "n.status = 'UNREAD'")
    Long countUnreadAdminNotifications(@Param("adminId") Long adminId);

    // Find notifications by type
    List<Notification> findByTypeAndRecipientUserIdOrderByCreatedAtDesc(NotificationType type, Long userId);

    // Find notifications by order
    List<Notification> findByRelatedOrderIdOrderByCreatedAtDesc(Long orderId);

    boolean existsByRelatedOrderAndTypeAndRecipientUser(Order order, NotificationType type, User user);

    // Mark notifications as read
    @Modifying
    @Query("UPDATE Notification n SET n.status = 'READ', n.readAt = :readAt WHERE n.id = :notificationId")
    void markAsRead(@Param("notificationId") Long notificationId, @Param("readAt") LocalDateTime readAt);

    @Modifying
    @Query("UPDATE Notification n SET n.status = 'READ', n.readAt = :readAt WHERE " +
           "((n.recipientType = 'USER' AND n.recipientUser.id = :userId) OR " +
           "(n.recipientType = 'ALL_USERS')) AND " +
           "n.status = 'UNREAD'")
    void markAllUserNotificationsAsRead(@Param("userId") Long userId, @Param("readAt") LocalDateTime readAt);

    @Modifying
    @Query("UPDATE Notification n SET n.status = 'READ', n.readAt = :readAt WHERE " +
           "((n.recipientType = 'ADMIN' AND (n.recipientUser IS NULL OR n.recipientUser.id = :adminId)) OR " +
           "(n.recipientType = 'ALL_ADMINS')) AND " +
           "n.status = 'UNREAD'")
    void markAllAdminNotificationsAsRead(@Param("adminId") Long adminId, @Param("readAt") LocalDateTime readAt);

    // Delete old notifications
    @Modifying
    @Query("DELETE FROM Notification n WHERE n.createdAt < :date")
    void deleteOldNotifications(@Param("date") LocalDateTime date);

    // Find by multiple criteria for search
    @Query("SELECT n FROM Notification n WHERE " +
           "((n.recipientType = 'USER' AND n.recipientUser.id = :userId) OR " +
           "(n.recipientType = 'ALL_USERS')) AND " +
           "(:type IS NULL OR n.type = :type) AND " +
           "(:status IS NULL OR n.status = :status) AND " +
           "(:search IS NULL OR LOWER(n.title) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(n.message) LIKE LOWER(CONCAT('%', :search, '%'))) " +
           "ORDER BY n.createdAt DESC")
    Page<Notification> searchUserNotifications(@Param("userId") Long userId,
                                              @Param("type") NotificationType type,
                                              @Param("status") NotificationStatus status,
                                              @Param("search") String search,
                                              Pageable pageable);

    @Query("SELECT n FROM Notification n WHERE " +
           "((n.recipientType = 'ADMIN' AND (n.recipientUser IS NULL OR n.recipientUser.id = :adminId)) OR " +
           "(n.recipientType = 'ALL_ADMINS')) AND " +
           "(:type IS NULL OR n.type = :type) AND " +
           "(:status IS NULL OR n.status = :status) AND " +
           "(:search IS NULL OR LOWER(n.title) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(n.message) LIKE LOWER(CONCAT('%', :search, '%'))) " +
           "ORDER BY n.createdAt DESC")
    Page<Notification> searchAdminNotifications(@Param("adminId") Long adminId,
                                               @Param("type") NotificationType type,
                                               @Param("status") NotificationStatus status,
                                               @Param("search") String search,
                                               Pageable pageable);

}
