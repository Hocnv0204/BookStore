package com.bookstore.backend.service;

import com.bookstore.backend.dto.UserResponse;
import com.bookstore.backend.dto.request.userrequest.UserUpdateRequest;
import com.bookstore.backend.dto.response.PageResponse;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;

public interface UserService {
    UserResponse updateUser(Long id, UserUpdateRequest request);
    void deleteUserById(Long id);
    PageResponse<UserResponse> getAllUsers(Pageable pageable);
    UserResponse getUserById(Long id);
    int getTotalSpending(String username);
    UserDetailsService loadUserDetailService();
    UserDetails loadUserByUsername(String username);
    UserResponse getUserProfile() ; 
}
