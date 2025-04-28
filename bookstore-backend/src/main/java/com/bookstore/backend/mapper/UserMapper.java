package com.bookstore.backend.mapper;

import com.bookstore.backend.dto.UserDto;
import com.bookstore.backend.model.User;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class UserMapper {
    private final PasswordEncoder passwordEncoder ;
    public  User toEntity(UserDto dto){
        User user = User.builder()
                .fullName(dto.getFullName())
                .dob(dto.getDob())
                .email(dto.getEmail())
                .username(dto.getUsername())
                .gender(dto.getGender())
                .password(passwordEncoder.encode(dto.getPassword()))
                .build() ;
        return user ;
    }
    public  UserDto toDto(User user){
        UserDto dto = UserDto.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .username(user.getUsername())
                .email(user.getEmail())
                .gender(user.getGender())
                .dob(user.getDob())
                .build() ;
        return dto ;
    }

}
