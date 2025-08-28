package com.bookstore.backend.controller;

import com.bookstore.backend.dto.request.*;
import com.bookstore.backend.dto.request.userrequest.*;
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
import jakarta.validation.Valid;
import com.bookstore.backend.common.enums.VerificationType;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthenticationService authenticationService ;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<?>> createUser(@RequestBody @Valid VerifyAndRegisterRequest request){
        var authenticationResponse = authenticationService.verifyAndRegister(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(
                ApiResponse.builder()
                        .message("Registration successful")
                        .data(authenticationResponse)
                        .build()
        );
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<?>> login(@RequestBody LoginRequest request){
        AuthenticationResponse result = authenticationService.login(request) ;
        return ResponseEntity.ok(
                ApiResponse.builder()
                        .data(result)
                        .message("Login successful")
                        .build()
        );
    }

    @PostMapping("/introspect")
    public ResponseEntity<ApiResponse<?>> authenticate(@RequestBody IntrospectRequest request)
            throws JOSEException, ParseException
    {
        var result = authenticationService.introspect(request) ;
        return ResponseEntity.ok(
                ApiResponse.builder()
                        .data(result)
                        .message("Token introspect successful")
                        .build()
        );
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<?>> logout(@RequestBody LogoutRequest request) throws ParseException, JOSEException {
        authenticationService.logout(request);
        return ResponseEntity.ok(
                ApiResponse.builder()
                        .data(null)
                        .message("Logout successful")
                        .build()
        );
    }

    @PostMapping("/refresh")
    public ResponseEntity<ApiResponse<?>> refresh(@RequestBody RefreshRequest request) throws ParseException, JOSEException {
        var result = authenticationService.refreshToken(request) ;
        return ResponseEntity.ok(
                ApiResponse.builder()
                        .data(result)
                        .message("Token refreshed successfully")
                        .build()
        );
    }

    @PostMapping("/send-verification-code")
    public ResponseEntity<ApiResponse<?>> sendRegisterCode(@RequestBody @Valid SendVerificationCodeRequest request) {
        authenticationService.sendVerificationCode(request.getEmail(), VerificationType.REGISTRATION);
        return ResponseEntity.ok().body(
            ApiResponse.builder()
                .data(null)
                .message("Verification code sent successfully")
                .build()
        );
    }

    @PostMapping("/send-reset-password-code")
    public ResponseEntity<ApiResponse<?>> sendResetPasswordCode(@RequestBody @Valid SendVerificationCodeRequest request) {
        authenticationService.sendVerificationCode(request.getEmail(), VerificationType.PASSWORD_RESET);
        return ResponseEntity.ok().body(
            ApiResponse.builder()
                .data(null)
                .message("Reset password code sent successfully")
                .build()
        );
    }

    @PostMapping("/verify-and-register")
    public ResponseEntity<ApiResponse<?>> verifyAndRegister(@RequestBody @Valid VerifyAndRegisterRequest request) {
        AuthenticationResponse response = authenticationService.verifyAndRegister(request);

        return ResponseEntity.ok().body(
            ApiResponse.builder()
                .message("Registration successful")
                .data(response)
                .build()
        );
    }

    @PostMapping("/reset-password")
    public ResponseEntity<ApiResponse<?>> resetPassword(@RequestBody @Valid ResetPasswordRequest request) {
        authenticationService.resetPassword(request);
        return ResponseEntity.ok().body(
            ApiResponse.builder()
                .data(null)
                .message("Password reset successfully")
                .build()
        );
    }
}
