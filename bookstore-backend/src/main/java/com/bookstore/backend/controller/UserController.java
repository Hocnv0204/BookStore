package com.bookstore.backend.controller;

import com.bookstore.backend.dto.UserDto;
import com.bookstore.backend.dto.request.UserCreationRequest;
import com.bookstore.backend.dto.request.UserUpdateRequest;
import com.bookstore.backend.dto.response.ApiResponse;
import com.bookstore.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("users")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService ;


    @GetMapping
    ResponseEntity<ApiResponse<List<UserDto>>> getAllUsers(){
        return ResponseEntity.ok().body(
                ApiResponse.<List<UserDto>>builder()
                        .result(userService.getAllUsers())
                        .build()
        ) ;
    }

    @GetMapping("/{id}")
    ResponseEntity<ApiResponse<UserDto>> getUserById(@PathVariable Long id ){
        return ResponseEntity.ok().body(
                ApiResponse.<UserDto>builder()
                        .result(userService.getUserById(id))
                        .build()
        ) ;
    }

    @PostMapping("/{id}")
    public ResponseEntity<ApiResponse<UserDto>> updateUser(@PathVariable Long id , @RequestBody UserUpdateRequest request){
        return ResponseEntity.ok().body(
                ApiResponse.<UserDto>builder()
                        .result(userService.updateUser(id , request))
                        .build()
        ) ;
    }
}
