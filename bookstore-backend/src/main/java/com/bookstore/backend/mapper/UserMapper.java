package com.bookstore.backend.mapper;

import com.bookstore.backend.dto.UserResponse;
import com.bookstore.backend.dto.request.userrequest.UserUpdateRequest;
import com.bookstore.backend.model.User;
import org.mapstruct.Builder;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;


@Mapper(componentModel = "spring", builder = @Builder(disableBuilder = false))
public interface UserMapper {


    @Mapping(target = "id", ignore = true)
    @Mapping(target = "password", ignore = true)
    @Mapping(target = "roles", ignore = true)
    void updateUser(@MappingTarget User user, UserUpdateRequest request);

    @Mapping(source = "id", target = "id")
    @Mapping(source = "username", target = "username")
    @Mapping(source = "fullName", target = "fullName")
    @Mapping(source = "email", target = "email")
    @Mapping(source = "dob", target = "dob")
    @Mapping(source = "gender", target = "gender")
    @Mapping(source = "roles", target = "roles")
    UserResponse toUserResponse(User user);

}


