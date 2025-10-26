package com.bookstore.backend.controller;

import com.bookstore.backend.dto.UserResponse;
import com.bookstore.backend.dto.request.userrequest.ChangePasswordRequest;
import com.bookstore.backend.dto.request.userrequest.UserUpdateRequest;
import com.bookstore.backend.dto.response.ApiResponse;
import com.bookstore.backend.dto.response.PageResponse;
import com.bookstore.backend.service.UserService;
import com.bookstore.backend.utils.PageableUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
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
@RequestMapping("/api/users")
public class UserController {
    private final UserService userService;
    private final UserRepository userRepository;
    
    @GetMapping("/admin")

    public ResponseEntity<ApiResponse<?>> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortOrder) {
        
        Pageable pageable = PageableUtils.setPageable(page, size, sortOrder, sortBy);
        PageResponse<UserResponse> response = userService.getAllUsers(pageable);
        return ResponseEntity.ok().body(
                ApiResponse.builder()
                        .data(response)
                        .message("Get all users")
                        .build()
        );
    }

    @GetMapping("/admin/{id}")

    public ResponseEntity<ApiResponse<?>> getUserById(@PathVariable Long id) {
        UserResponse user = userService.getUserById(id);
        return ResponseEntity.ok().body(
                ApiResponse.builder()
                        .data(user)
                        .message("Get user by id")
                        .build()
        );
    }

    @GetMapping("/{username}/spending")

    public ResponseEntity<ApiResponse<?>> getTotalSpending(@PathVariable String username) {
        Integer spending = userService.getTotalSpending(username);
        return ResponseEntity.ok().body(
                ApiResponse.builder()
                        .data(spending)
                        .message("Get total spending")
                        .build()
        );
    }

    @PutMapping

    public ResponseEntity<ApiResponse<?>> updateUser(@RequestBody UserUpdateRequest request) {
        UserResponse user = userService.updateUser(request);
        return ResponseEntity.ok().body(
                ApiResponse.builder()
                        .data(user)
                        .message("User updated successfully")
                        .build()
        );
    }

    @DeleteMapping("/admin/{id}")

    public ResponseEntity<ApiResponse<?>> deleteUser(@PathVariable Long id) {
        userService.deleteUserById(id);
        return ResponseEntity.ok().body(
                ApiResponse.builder()
                        .data(null)
                        .message("User deleted successfully")
                        .build()
        );
    }

    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<?>> getUserProfile() {
        UserResponse user = userService.getUserProfile();
        return ResponseEntity.ok().body(
            ApiResponse.builder()
                .data(user)
                .message("Get user profile")
                .build()
        );
    }

    @PutMapping("/change-password")

    public ResponseEntity<ApiResponse<?>> changePassword(@RequestBody ChangePasswordRequest request) {
        userService.changePassword(request);
        return ResponseEntity.ok().body(
            ApiResponse.builder()
                .data(null)
                .message("Password changed successfully")
                .build()
        );
    }

    @GetMapping("/admin/search")

    public ResponseEntity<ApiResponse<?>> searchUsersByName(
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortOrder) {
        
        Pageable pageable = PageableUtils.setPageable(page, size, sortOrder, sortBy);
        
        if (keyword == null) {
            keyword = "";
        }
        
        PageResponse<UserResponse> response = userService.searchUsersByName(keyword.trim(), pageable);
        return ResponseEntity.ok().body(
            ApiResponse.builder()
                .data(response)
                .message("Search users by name")
                .build()
        );
    }
}
