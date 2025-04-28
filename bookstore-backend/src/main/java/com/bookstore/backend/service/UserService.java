package com.bookstore.backend.service;

import com.bookstore.backend.dto.UserDto;
import com.bookstore.backend.model.User;

import java.util.List;

public interface UserService {
    UserDto createUser(UserDto dto) ;
    UserDto updateUser(Long id, UserDto dto ) ;
    void deleteUserById(Long id) ;
    List<UserDto> getAllUsers() ;
    UserDto getUserById(Long id) ;
}
