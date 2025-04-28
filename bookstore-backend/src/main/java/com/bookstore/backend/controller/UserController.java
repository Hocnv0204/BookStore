package com.bookstore.backend.controller;

import com.bookstore.backend.dto.UserDto;
import com.bookstore.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/users")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService ;

    @PostMapping
    public ResponseEntity<?> createUser(@RequestBody UserDto userDto){
        return ResponseEntity.ok(userService.createUser(userDto)) ;
    }

    @GetMapping
    public ResponseEntity<?> findAllUsers(){
        return ResponseEntity.ok(userService.getAllUsers()) ;
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> findUserById(@PathVariable Long id){
        return ResponseEntity.ok(userService.getUserById(id)) ;
    }

    @PostMapping("/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id , @RequestBody UserDto userDto){
        return ResponseEntity.ok(userService.updateUser(id , userDto)) ;
    }
}
