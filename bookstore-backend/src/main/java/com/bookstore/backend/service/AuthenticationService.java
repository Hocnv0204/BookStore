package com.bookstore.backend.service;

import com.bookstore.backend.dto.request.*;
import com.bookstore.backend.dto.request.userrequest.*;
import com.bookstore.backend.dto.response.AuthenticationResponse;
import com.bookstore.backend.dto.response.IntrospectResponse;
import com.nimbusds.jose.JOSEException;
import com.bookstore.backend.common.enums.VerificationType;

import java.text.ParseException;

public interface AuthenticationService {
    void sendVerificationCode(String email, VerificationType type);
    AuthenticationResponse verifyAndRegister(VerifyAndRegisterRequest request);
    AuthenticationResponse login(LoginRequest loginRequest);
    void logout(LogoutRequest logoutRequest) throws JOSEException, ParseException;
    IntrospectResponse introspect(IntrospectRequest introspectRequest) throws JOSEException, ParseException;
    AuthenticationResponse refreshToken(RefreshRequest request) throws JOSEException, ParseException;
    void resetPassword(ResetPasswordRequest request);
}
