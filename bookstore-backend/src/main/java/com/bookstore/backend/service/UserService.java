package com.bookstore.backend.service;

import com.bookstore.backend.dto.UserDto;
import com.bookstore.backend.dto.request.UserCreationRequest;
import com.bookstore.backend.dto.request.UserUpdateRequest;
import com.bookstore.backend.model.User;

import java.util.List;

public interface UserService {
    UserDto updateUser(Long id, UserUpdateRequest request ) ;
    void deleteUserById(Long id) ;
    List<UserDto> getAllUsers() ;
    UserDto getUserById(Long id) ;
}
