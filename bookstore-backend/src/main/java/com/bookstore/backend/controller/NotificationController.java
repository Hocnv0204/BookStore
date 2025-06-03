package com.bookstore.backend.controller;

import com.bookstore.backend.common.enums.NotificationStatus;
import com.bookstore.backend.common.enums.NotificationType;
import com.bookstore.backend.dto.NotificationDto;
import com.bookstore.backend.dto.request.NotificationRequest;
import com.bookstore.backend.dto.response.ApiResponse;
import com.bookstore.backend.dto.response.NotificationStatsResponse;
import com.bookstore.backend.dto.response.PageResponse;
import com.bookstore.backend.service.NotificationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping
@RequiredArgsConstructor
public class NotificationController {
    
    private final NotificationService notificationService;
    private static final int MAX_PAGE_SIZE = 50;

    // ===== USER NOTIFICATION ENDPOINTS =====
    
    @GetMapping("/users/notifications")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<PageResponse<NotificationDto>> getUserNotifications(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortOrder) {
        
        size = Math.min(size, MAX_PAGE_SIZE);
        Pageable pageable = PageRequest.of(page, size,
                Sort.Direction.fromString(sortOrder), sortBy);
        
        return ResponseEntity.ok(notificationService.getUserNotifications(pageable));
    }

    @GetMapping("/users/notifications/status/{status}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<PageResponse<NotificationDto>> getUserNotificationsByStatus(
            @PathVariable NotificationStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortOrder) {
        
        size = Math.min(size, MAX_PAGE_SIZE);
        Pageable pageable = PageRequest.of(page, size,
                Sort.Direction.fromString(sortOrder), sortBy);
        
        return ResponseEntity.ok(notificationService.getUserNotificationsByStatus(status, pageable));
    }

    @GetMapping("/users/notifications/search")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<PageResponse<NotificationDto>> searchUserNotifications(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) NotificationType type,
            @RequestParam(required = false) NotificationStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortOrder) {
        
        size = Math.min(size, MAX_PAGE_SIZE);
        Pageable pageable = PageRequest.of(page, size,
                Sort.Direction.fromString(sortOrder), sortBy);
        
        return ResponseEntity.ok(notificationService.searchUserNotifications(search, type, status, pageable));
    }

    @GetMapping("/users/notifications/stats")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<NotificationStatsResponse> getUserNotificationStats() {
        return ResponseEntity.ok(notificationService.getUserNotificationStats());
    }

    @GetMapping("/users/notifications/unread-count")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ApiResponse<Long>> getUnreadUserNotificationCount() {
        return ResponseEntity.ok(ApiResponse.<Long>builder()
                .result(notificationService.getUnreadUserNotificationCount())
                .build());
    }

    // ===== ADMIN NOTIFICATION ENDPOINTS =====

    @GetMapping("/admin/notifications")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PageResponse<NotificationDto>> getAdminNotifications(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortOrder) {
        
        size = Math.min(size, MAX_PAGE_SIZE);
        Pageable pageable = PageRequest.of(page, size,
                Sort.Direction.fromString(sortOrder), sortBy);
        
        return ResponseEntity.ok(notificationService.getAdminNotifications(pageable));
    }

    @GetMapping("/admin/notifications/status/{status}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PageResponse<NotificationDto>> getAdminNotificationsByStatus(
            @PathVariable NotificationStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortOrder) {
        
        size = Math.min(size, MAX_PAGE_SIZE);
        Pageable pageable = PageRequest.of(page, size,
                Sort.Direction.fromString(sortOrder), sortBy);
        
        return ResponseEntity.ok(notificationService.getAdminNotificationsByStatus(status, pageable));
    }

    @GetMapping("/admin/notifications/search")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PageResponse<NotificationDto>> searchAdminNotifications(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) NotificationType type,
            @RequestParam(required = false) NotificationStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortOrder) {
        
        size = Math.min(size, MAX_PAGE_SIZE);
        Pageable pageable = PageRequest.of(page, size,
                Sort.Direction.fromString(sortOrder), sortBy);
        
        return ResponseEntity.ok(notificationService.searchAdminNotifications(search, type, status, pageable));
    }

    @GetMapping("/admin/notifications/stats")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<NotificationStatsResponse> getAdminNotificationStats() {
        return ResponseEntity.ok(notificationService.getAdminNotificationStats());
    }

    @GetMapping("/admin/notifications/unread-count")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Long>> getUnreadAdminNotificationCount() {
        return ResponseEntity.ok(ApiResponse.<Long>builder()
                .result(notificationService.getUnreadAdminNotificationCount())
                .build());
    }

    // ===== COMMON NOTIFICATION ACTIONS =====

    @GetMapping("/notifications/{id}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<ApiResponse<NotificationDto>> getNotificationById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.<NotificationDto>builder()
                .result(notificationService.getNotificationById(id))
                .build());
    }

    @PutMapping("/notifications/{id}/mark-read")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<ApiResponse<NotificationDto>> markNotificationAsRead(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.<NotificationDto>builder()
                .message("Notification marked as read")
                .result(notificationService.markNotificationAsRead(id))
                .build());
    }

    @PutMapping("/notifications/mark-all-read")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<ApiResponse<Void>> markAllNotificationsAsRead() {
        notificationService.markAllNotificationsAsRead();
        return ResponseEntity.ok(ApiResponse.<Void>builder()
                .message("All notifications marked as read")
                .build());
    }

    @PutMapping("/notifications/mark-multiple-read")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<ApiResponse<Void>> markMultipleNotificationsAsRead(
            @RequestBody List<Long> notificationIds) {
        notificationService.markMultipleNotificationsAsRead(notificationIds);
        return ResponseEntity.ok(ApiResponse.<Void>builder()
                .message("Selected notifications marked as read")
                .build());
    }

    @DeleteMapping("/notifications/{id}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteNotification(@PathVariable Long id) {
        notificationService.deleteNotification(id);
        return ResponseEntity.ok(ApiResponse.<Void>builder()
                .message("Notification deleted successfully")
                .build());
    }

    @DeleteMapping("/notifications/multiple")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteMultipleNotifications(
            @RequestBody List<Long> notificationIds) {
        notificationService.deleteMultipleNotifications(notificationIds);
        return ResponseEntity.ok(ApiResponse.<Void>builder()
                .message("Selected notifications deleted successfully")
                .build());
    }

    @DeleteMapping("/notifications/read")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteAllReadNotifications() {
        notificationService.deleteAllReadNotifications();
        return ResponseEntity.ok(ApiResponse.<Void>builder()
                .message("All read notifications deleted successfully")
                .build());
    }

    // ===== CUSTOM NOTIFICATION CREATION (ADMIN ONLY) =====

    @PostMapping("/admin/notifications/custom")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<NotificationDto>> createCustomNotification(
            @Valid @RequestBody NotificationRequest request) {
        return ResponseEntity.ok(ApiResponse.<NotificationDto>builder()
                .message("Custom notification created successfully")
                .result(notificationService.createCustomNotification(request))
                .build());
    }

    // ===== SYSTEM MAINTENANCE (ADMIN ONLY) =====

    @DeleteMapping("/admin/notifications/cleanup")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> cleanupOldNotifications(
            @RequestParam(defaultValue = "30") int daysOld) {
        notificationService.cleanupOldNotifications(daysOld);
        return ResponseEntity.ok(ApiResponse.<Void>builder()
                .message(String.format("Notifications older than %d days have been cleaned up", daysOld))
                .build());
    }
}
