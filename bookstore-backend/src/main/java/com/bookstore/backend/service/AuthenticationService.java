package com.bookstore.backend.service;


import com.bookstore.backend.dto.request.*;
import com.bookstore.backend.dto.request.userrequest.*;
import com.bookstore.backend.dto.response.AuthenticationResponse;
import com.bookstore.backend.dto.response.IntrospectResponse;
import com.nimbusds.jose.JOSEException;

import java.text.ParseException;

public interface AuthenticationService {
    AuthenticationResponse login(LoginRequest loginRequest) ;
    void logout(LogoutRequest logoutRequest) throws JOSEException , ParseException ;
    IntrospectResponse  introspect(IntrospectRequest introspectRequest) throws JOSEException , ParseException;
    AuthenticationResponse refreshToken(RefreshRequest request) throws  JOSEException , ParseException ;
    AuthenticationResponse register(UserCreationRequest request) ;
}
