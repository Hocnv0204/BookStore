package com.bookstore.backend.service.impl;

import com.bookstore.backend.dto.UserDto;
import com.bookstore.backend.mapper.UserMapper;
import com.bookstore.backend.model.User;
import com.bookstore.backend.repository.UserRepository;
import com.bookstore.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository ;
    private final UserMapper userMapper ;
    @Override
    public UserDto createUser(UserDto userDto){
        User user = userMapper.toEntity(userDto) ;
        return userMapper.toDto(userRepository.save(user)) ;
    }

    @Override
    public UserDto updateUser(Long id , UserDto userDto ){
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found")) ;
        user.setDob(userDto.getDob());
        user.setGender(userDto.getGender());
        user.setPassword(userDto.getPassword());
        user.setFullName(userDto.getFullName());
        return userMapper.toDto(userRepository.save(user)) ;
    }

    @Override
    public UserDto getUserById(Long id){
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found")) ;
        return userMapper.toDto(user) ;
    }

    @Override
    public void deleteUserById(Long id){
        userRepository.deleteById(id) ;
    }

    @Override
    public List<UserDto> getAllUsers(){
        return userRepository.findAll().stream()
                .map(userMapper::toDto)
                .collect(Collectors.toList()) ;
    }
}
