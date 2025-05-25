package com.bookstore.backend.controller;

import com.bookstore.backend.dto.UserResponse;
import com.bookstore.backend.dto.request.userrequest.ChangePasswordRequest;
import com.bookstore.backend.dto.request.userrequest.UserUpdateRequest;
import com.bookstore.backend.dto.response.ApiResponse;
import com.bookstore.backend.dto.response.PageResponse;
import com.bookstore.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import com.bookstore.backend.common.enums.ErrorCode;
import com.bookstore.backend.exception.AppException;
import com.bookstore.backend.model.User;
import com.bookstore.backend.repository.UserRepository;
@RestController
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;
    private static final int MAX_PAGE_SIZE = 20;
    private final UserRepository userRepository;
    
    @GetMapping("admin/users")
    @PreAuthorize("hasRole('ADMIN')")
    ResponseEntity<ApiResponse<PageResponse<UserResponse>>> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortOrder) {
        
        // Validate and adjust page size
        size = Math.min(size, MAX_PAGE_SIZE);
        
        // Sorting
        Sort.Direction direction = Sort.Direction.fromString(sortOrder.toUpperCase());
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));
        return ResponseEntity.ok().body(
                ApiResponse.<PageResponse<UserResponse>>builder()
                        .result(userService.getAllUsers(pageable))
                        .build()
        );
    }

    @GetMapping("admin/users/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    ResponseEntity<ApiResponse<UserResponse>> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok().body(
                ApiResponse.<UserResponse>builder()
                        .result(userService.getUserById(id))
                        .build()
        );
    }

    @GetMapping("users/{username}/spending")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN') and (authentication.principal.username == #username or hasRole('ADMIN'))")
    ResponseEntity<ApiResponse<Integer>> getTotalSpending(@PathVariable String username) {
        return ResponseEntity.ok().body(
                ApiResponse.<Integer>builder()
                        .result(userService.getTotalSpending(username))
                        .build()
        );
    }

    @PutMapping("users")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<ApiResponse<UserResponse>> updateUser(@RequestBody UserUpdateRequest request) {
        return ResponseEntity.ok().body(
                ApiResponse.<UserResponse>builder()
                        .result(userService.updateUser(request))
                        .build()
        );
    }

    @DeleteMapping("admin/users/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteUser(@PathVariable Long id) {
        userService.deleteUserById(id);
        return ResponseEntity.ok().body(
                ApiResponse.<Void>builder()
                        .build()
        );
    }

    @GetMapping("users/profile")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<ApiResponse<UserResponse>> getUserProfile() {
        return ResponseEntity.ok().body(
            ApiResponse.<UserResponse>builder()
                .result(userService.getUserProfile())
                .build()
        );
    }

    @PutMapping("users/change-password")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<ApiResponse<Void>> changePassword(@RequestBody ChangePasswordRequest request) {
        userService.changePassword(request);
        return ResponseEntity.ok().body(
            ApiResponse.<Void>builder()
                .message("Password changed successfully")
                .build()
        );
    }

    @GetMapping("admin/users/search")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<PageResponse<UserResponse>>> searchUsersByName(
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortOrder) {
        
        size = Math.min(size, MAX_PAGE_SIZE);
        Sort.Direction direction = Sort.Direction.fromString(sortOrder.toUpperCase());
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));
        
        if (keyword == null) {
            keyword = "";
        }
        
        return ResponseEntity.ok().body(
            ApiResponse.<PageResponse<UserResponse>>builder()
                .result(userService.searchUsersByName(keyword.trim(), pageable))
                .build()
        );
    }
}
