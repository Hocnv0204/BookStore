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
import org.springframework.web.bind.annotation.RestController;
import java.text.ParseException;
import jakarta.validation.Valid;
import com.bookstore.backend.common.enums.VerificationType;

@RestController
@RequiredArgsConstructor
public class AuthController {
    private final AuthenticationService authenticationService ;

    @PostMapping("/register")
    ResponseEntity<ApiResponse<AuthenticationResponse>> createUser(@RequestBody @Valid VerifyAndRegisterRequest request){
        var authenticationResponse = authenticationService.verifyAndRegister(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(
                ApiResponse.<AuthenticationResponse>builder()
                        .message("Registration successful")
                        .result(authenticationResponse)
                        .build()
        );
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

    @PostMapping("users/logout")
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

    @PostMapping("/auth/send-verification-code")
    public ResponseEntity<ApiResponse<Void>> sendRegisterCode(@RequestBody @Valid SendVerificationCodeRequest request) {
        authenticationService.sendVerificationCode(request.getEmail(), VerificationType.REGISTRATION);
        return ResponseEntity.ok().body(
            ApiResponse.<Void>builder()
                .message("Verification code sent successfully")
                .build()
        );
    }

    @PostMapping("/auth/send-reset-password-code")
    public ResponseEntity<ApiResponse<Void>> sendResetPasswordCode(@RequestBody @Valid SendVerificationCodeRequest request) {
        authenticationService.sendVerificationCode(request.getEmail(), VerificationType.PASSWORD_RESET);
        return ResponseEntity.ok().body(
            ApiResponse.<Void>builder()
                .message("Reset password code sent successfully")
                .build()
        );
    }

    @PostMapping("auth/verify-and-register")
    public ResponseEntity<ApiResponse<AuthenticationResponse>> verifyAndRegister(@RequestBody @Valid VerifyAndRegisterRequest request) {
        AuthenticationResponse response = authenticationService.verifyAndRegister(request);
        System.out.println("DOB received: " + request.getDob());
        return ResponseEntity.ok().body(
            ApiResponse.<AuthenticationResponse>builder()
                .message("Registration successful")
                .result(response)
                .build()
        );
    }

    @PostMapping("/auth/reset-password")
public ResponseEntity<ApiResponse<Void>> resetPassword(@RequestBody @Valid ResetPasswordRequest request) {
    authenticationService.resetPassword(request);
    return ResponseEntity.ok().body(
        ApiResponse.<Void>builder()
            .message("Password reset successfully")
            .build()
    );
}
}
