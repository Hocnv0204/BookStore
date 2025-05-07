package com.bookstore.backend.mapper;

import com.bookstore.backend.common.enums.Role;
import com.bookstore.backend.dto.UserDto;
import com.bookstore.backend.dto.request.UserCreationRequest;
import com.bookstore.backend.dto.request.UserUpdateRequest;
import com.bookstore.backend.model.User;
import org.mapstruct.Builder;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import java.util.Set;
import java.util.stream.Collectors;


@Mapper(componentModel = "spring", builder = @Builder(disableBuilder = false))
public interface UserMapper {

    User toUser(UserCreationRequest request);

    void updateUser(@MappingTarget User user, UserUpdateRequest request);

    @Mapping(source = "id", target = "id")
    @Mapping(source = "username", target = "username")
    @Mapping(source = "fullName", target = "fullName")
    @Mapping(source = "email", target = "email")
    @Mapping(source = "dob", target = "dob")
    @Mapping(source = "gender", target = "gender")
    @Mapping(source = "roles", target = "roles")
    UserDto toUserDto(User user);

}


