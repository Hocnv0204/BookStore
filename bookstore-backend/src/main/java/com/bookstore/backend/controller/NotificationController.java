package com.bookstore.backend.controller;

import com.bookstore.backend.common.enums.NotificationStatus;
import com.bookstore.backend.common.enums.NotificationType;
import com.bookstore.backend.dto.NotificationDto;
import com.bookstore.backend.dto.request.NotificationRequest;
import com.bookstore.backend.dto.response.ApiResponse;
import com.bookstore.backend.dto.response.NotificationStatsResponse;
import com.bookstore.backend.dto.response.PageResponse;
import com.bookstore.backend.service.NotificationService;
import com.bookstore.backend.utils.PageableUtils;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {
    
    private final NotificationService notificationService;

    // ===== USER NOTIFICATION ENDPOINTS =====
    
    @GetMapping("/users")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<ApiResponse<?>> getUserNotifications(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortOrder) {
        
        Pageable pageable = PageableUtils.setPageable(page, size, sortOrder, sortBy);
        PageResponse<NotificationDto> response = notificationService.getUserNotifications(pageable);
        
        return ResponseEntity.ok(
                ApiResponse.builder()
                        .data(response)
                        .message("Get user notifications")
                        .build()
        );
    }

    @GetMapping("/users/status/{status}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ApiResponse<?>> getUserNotificationsByStatus(
            @PathVariable NotificationStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortOrder) {
        
        Pageable pageable = PageableUtils.setPageable(page, size, sortOrder, sortBy);
        PageResponse<NotificationDto> response = notificationService.getUserNotificationsByStatus(status, pageable);
        
        return ResponseEntity.ok(
                ApiResponse.builder()
                        .data(response)
                        .message("Get user notifications by status")
                        .build()
        );
    }

    @GetMapping("/users/search")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ApiResponse<?>> searchUserNotifications(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) NotificationType type,
            @RequestParam(required = false) NotificationStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortOrder) {
        
        Pageable pageable = PageableUtils.setPageable(page, size, sortOrder, sortBy);
        PageResponse<NotificationDto> response = notificationService.searchUserNotifications(search, type, status, pageable);
        
        return ResponseEntity.ok(
                ApiResponse.builder()
                        .data(response)
                        .message("Search user notifications")
                        .build()
        );
    }

    @GetMapping("/users/stats")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ApiResponse<?>> getUserNotificationStats() {
        NotificationStatsResponse stats = notificationService.getUserNotificationStats();
        return ResponseEntity.ok(
                ApiResponse.builder()
                        .data(stats)
                        .message("Get user notification stats")
                        .build()
        );
    }

    @GetMapping("/users/unread-count")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ApiResponse<?>> getUnreadUserNotificationCount() {
        Long count = notificationService.getUnreadUserNotificationCount();
        return ResponseEntity.ok(
                ApiResponse.builder()
                        .data(count)
                        .message("Get unread user notification count")
                        .build()
        );
    }

    // ===== ADMIN NOTIFICATION ENDPOINTS =====

    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<?>> getAdminNotifications(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortOrder) {
        
        Pageable pageable = PageableUtils.setPageable(page, size, sortOrder, sortBy);
        PageResponse<NotificationDto> response = notificationService.getAdminNotifications(pageable);
        
        return ResponseEntity.ok(
                ApiResponse.builder()
                        .data(response)
                        .message("Get admin notifications")
                        .build()
        );
    }

    @GetMapping("/admin/status/{status}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<?>> getAdminNotificationsByStatus(
            @PathVariable NotificationStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortOrder) {
        
        Pageable pageable = PageableUtils.setPageable(page, size, sortOrder, sortBy);
        PageResponse<NotificationDto> response = notificationService.getAdminNotificationsByStatus(status, pageable);
        
        return ResponseEntity.ok(
                ApiResponse.builder()
                        .data(response)
                        .message("Get admin notifications by status")
                        .build()
        );
    }

    @GetMapping("/admin/search")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<?>> searchAdminNotifications(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) NotificationType type,
            @RequestParam(required = false) NotificationStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortOrder) {
        
        Pageable pageable = PageableUtils.setPageable(page, size, sortOrder, sortBy);
        PageResponse<NotificationDto> response = notificationService.searchAdminNotifications(search, type, status, pageable);
        
        return ResponseEntity.ok(
                ApiResponse.builder()
                        .data(response)
                        .message("Search admin notifications")
                        .build()
        );
    }

    @GetMapping("/admin/stats")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<?>> getAdminNotificationStats() {
        NotificationStatsResponse stats = notificationService.getAdminNotificationStats();
        return ResponseEntity.ok(
                ApiResponse.builder()
                        .data(stats)
                        .message("Get admin notification stats")
                        .build()
        );
    }

    @GetMapping("/admin/unread-count")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<?>> getUnreadAdminNotificationCount() {
        Long count = notificationService.getUnreadAdminNotificationCount();
        return ResponseEntity.ok(
                ApiResponse.builder()
                        .data(count)
                        .message("Get unread admin notification count")
                        .build()
        );
    }

    // ===== COMMON NOTIFICATION ACTIONS =====

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<ApiResponse<?>> getNotificationById(@PathVariable Long id) {
        NotificationDto notification = notificationService.getNotificationById(id);
        return ResponseEntity.ok(
                ApiResponse.builder()
                        .data(notification)
                        .message("Get notification by id")
                        .build()
        );
    }

    @PutMapping("/{id}/mark-read")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<ApiResponse<?>> markNotificationAsRead(@PathVariable Long id) {
        NotificationDto notification = notificationService.markNotificationAsRead(id);
        return ResponseEntity.ok(
                ApiResponse.builder()
                        .data(notification)
                        .message("Notification marked as read")
                        .build()
        );
    }

    @PutMapping("/mark-all-read")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<ApiResponse<?>> markAllNotificationsAsRead() {
        notificationService.markAllNotificationsAsRead();
        return ResponseEntity.ok(
                ApiResponse.builder()
                        .data(null)
                        .message("All notifications marked as read")
                        .build()
        );
    }

    @PutMapping("/mark-multiple-read")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<ApiResponse<?>> markMultipleNotificationsAsRead(
            @RequestBody List<Long> notificationIds) {
        notificationService.markMultipleNotificationsAsRead(notificationIds);
        return ResponseEntity.ok(
                ApiResponse.builder()
                        .data(null)
                        .message("Selected notifications marked as read")
                        .build()
        );
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<ApiResponse<?>> deleteNotification(@PathVariable Long id) {
        notificationService.deleteNotification(id);
        return ResponseEntity.ok(
                ApiResponse.builder()
                        .data(null)
                        .message("Notification deleted successfully")
                        .build()
        );
    }

    @DeleteMapping("/multiple")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<ApiResponse<?>> deleteMultipleNotifications(
            @RequestBody List<Long> notificationIds) {
        notificationService.deleteMultipleNotifications(notificationIds);
        return ResponseEntity.ok(
                ApiResponse.builder()
                        .data(null)
                        .message("Selected notifications deleted successfully")
                        .build()
        );
    }

    @DeleteMapping("/read")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<ApiResponse<?>> deleteAllReadNotifications() {
        notificationService.deleteAllReadNotifications();
        return ResponseEntity.ok(
                ApiResponse.builder()
                        .data(null)
                        .message("All read notifications deleted successfully")
                        .build()
        );
    }

    // ===== CUSTOM NOTIFICATION CREATION (ADMIN ONLY) =====

    @PostMapping("/admin/custom")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<?>> createCustomNotification(
            @Valid @RequestBody NotificationRequest request) {
        NotificationDto notification = notificationService.createCustomNotification(request);
        return ResponseEntity.ok(
                ApiResponse.builder()
                        .data(notification)
                        .message("Custom notification created successfully")
                        .build()
        );
    }

    // ===== SYSTEM MAINTENANCE (ADMIN ONLY) =====

    @DeleteMapping("/admin/cleanup")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<?>> cleanupOldNotifications(
            @RequestParam(defaultValue = "30") int daysOld) {
        notificationService.cleanupOldNotifications(daysOld);
        return ResponseEntity.ok(
                ApiResponse.builder()
                        .data(null)
                        .message(String.format("Notifications older than %d days have been cleaned up", daysOld))
                        .build()
        );
    }
}
