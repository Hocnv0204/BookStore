package com.bookstore.backend.controller;

import com.bookstore.backend.dto.UserDto;
import com.bookstore.backend.dto.request.*;
import com.bookstore.backend.dto.response.ApiResponse;
import com.bookstore.backend.dto.response.AuthenticationResponse;
import com.bookstore.backend.dto.response.IntrospectResponse;
import com.bookstore.backend.service.AuthenticationService;
import com.nimbusds.jose.JOSEException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.text.ParseException;

@RequestMapping("auth")
@RestController
@RequiredArgsConstructor
public class AuthController {
    private final AuthenticationService authenticationService ;

    @PostMapping("/register")
    ResponseEntity<ApiResponse<AuthenticationResponse>> createUser(@RequestBody UserCreationRequest request){
        var authenticationResponse = authenticationService.register(request) ;
        return ResponseEntity.status(HttpStatus.CREATED).body(
                ApiResponse.<AuthenticationResponse>builder()
                        .result(authenticationResponse)
                        .build()
        ) ;

    }

    @PostMapping("/login")
    ApiResponse<AuthenticationResponse> login(@RequestBody LoginRequest request){
        AuthenticationResponse result = authenticationService.login(request) ;
        return ApiResponse.<AuthenticationResponse>builder()
                .result(result)
                .build() ;
    }

    @PostMapping("/introspect")
    ApiResponse<IntrospectResponse> authenticate(@RequestBody IntrospectRequest request)
            throws JOSEException, ParseException
    {
        var result = authenticationService.introspect(request) ;
        return ApiResponse.<IntrospectResponse>builder()
                .result(result)
                .build() ;
    }

    @PostMapping("/logout")
    ApiResponse<Void> logout(@RequestBody LogoutRequest request) throws ParseException, JOSEException {
        authenticationService.logout(request);
        return ApiResponse.<Void>builder()
                .build() ;
    }

    @PostMapping("/refresh")
    ApiResponse<AuthenticationResponse> refresh(@RequestBody RefreshRequest request) throws ParseException, JOSEException {
        var result = authenticationService.refreshToken(request) ;
        return ApiResponse.<AuthenticationResponse>builder()
                .result(result)
                .build() ;
    }
}
