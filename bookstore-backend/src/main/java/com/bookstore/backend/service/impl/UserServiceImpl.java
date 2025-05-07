package com.bookstore.backend.service.impl;

import com.bookstore.backend.common.enums.Role;
import com.bookstore.backend.dto.UserDto;
import com.bookstore.backend.dto.request.UserCreationRequest;
import com.bookstore.backend.dto.request.UserUpdateRequest;
import com.bookstore.backend.exception.AppException;
import com.bookstore.backend.exception.ErrorCode;
import com.bookstore.backend.mapper.UserMapper;
import com.bookstore.backend.model.User;
import com.bookstore.backend.repository.UserRepository;
import com.bookstore.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository ;
    private final UserMapper userMapper ;
    private final PasswordEncoder passwordEncoder ;

    @Override
    public UserDto updateUser(Long id , UserUpdateRequest request){
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found")) ;
        userMapper.updateUser(user , request);
        userRepository.save(user) ;
        return userMapper.toUserDto(user) ;
    }

    @Override
    public UserDto getUserById(Long id){
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found")) ;
        return userMapper.toUserDto(user) ;
    }

    @Override
    public void deleteUserById(Long id){
        userRepository.deleteById(id) ;
    }

    @Override
    public List<UserDto> getAllUsers(){
        return userRepository.findAll().stream()
                .map(userMapper::toUserDto)
                .collect(Collectors.toList()) ;
    }
}
