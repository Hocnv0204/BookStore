package com.bookstore.backend.service.impl;

import com.bookstore.backend.common.enums.Role;
import com.bookstore.backend.dto.request.*;
import com.bookstore.backend.dto.request.userrequest.*;
import com.bookstore.backend.dto.response.AuthenticationResponse;
import com.bookstore.backend.dto.response.IntrospectResponse;
import com.bookstore.backend.exception.AppException;
import com.bookstore.backend.common.enums.ErrorCode;
import com.bookstore.backend.model.InvalidatedToken;
import com.bookstore.backend.model.User;
import com.bookstore.backend.repository.InvalidatedTokenRepository;
import com.bookstore.backend.repository.UserRepository;
import com.bookstore.backend.service.AuthenticationService;
import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import lombok.RequiredArgsConstructor;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;


import java.text.ParseException;
import java.time.Instant;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.HashSet;
import java.util.StringJoiner;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j

public class AuthenticationServiceImpl implements AuthenticationService {
    final UserRepository userRepository ;
    private final PasswordEncoder passwordEncoder;
    private final InvalidatedTokenRepository invalidatedTokenRepository ;
    @NonFinal
    @Value("${spring.jwt.signerKey}")
    protected String SIGNER_KEY ;

    @NonFinal
    @Value("${spring.jwt.valid-duration}")
    protected int VALID_DURATION ;

    @NonFinal
    @Value("${spring.jwt.refreshable-duration}")
    protected int REFRESHABLE_DURATION ;

    private String generateAccessToken(User user ){
        JWSHeader header = new JWSHeader(JWSAlgorithm.HS512) ;

        JWTClaimsSet jwtClaimsSet = new JWTClaimsSet.Builder()
                .subject(user.getUsername())
                .issuer("Hoc Nguyen")
                .issueTime(new Date())
                .expirationTime(new Date(
                        Instant.now().plus(VALID_DURATION , ChronoUnit.SECONDS).toEpochMilli()
                ))
                .jwtID(UUID.randomUUID().toString())
                .claim("scope" , buildScope(user))
                .build() ;
        Payload payload = new Payload(jwtClaimsSet.toJSONObject()) ;
        JWSObject jwsObject = new JWSObject(header , payload) ;
                try{
                    jwsObject.sign(new MACSigner(SIGNER_KEY.getBytes()));
                    return jwsObject.serialize() ;
                }catch(JOSEException e){
                    throw new RuntimeException(e) ;
        }
    }

    private String generateRefreshToken(User user) {
        JWSHeader header = new JWSHeader(JWSAlgorithm.HS512);

        JWTClaimsSet jwtClaimsSet = new JWTClaimsSet.Builder()
                .subject(user.getUsername())
                .issuer("Hoc Nguyen")
                .issueTime(new Date())
                .expirationTime(new Date(
                        Instant.now().plus(REFRESHABLE_DURATION, ChronoUnit.SECONDS).toEpochMilli()
                ))
                .jwtID(UUID.randomUUID().toString())
                .claim("scope", buildScope(user))  
                .build();

        Payload payload = new Payload(jwtClaimsSet.toJSONObject());
        JWSObject jwsObject = new JWSObject(header, payload);

        try {
            jwsObject.sign(new MACSigner(SIGNER_KEY.getBytes()));
            return jwsObject.serialize();
        } catch (JOSEException e) {
            throw new RuntimeException(e);
        }
    }

    private String buildScope(User user ){
        StringJoiner stringJoiner = new StringJoiner(" ") ;
        if(!CollectionUtils.isEmpty(user.getRoles())){
            user.getRoles().forEach(stringJoiner::add);
        }
        return stringJoiner.toString() ;
    }

    private SignedJWT verifyToken(String token , boolean isRefresh) throws ParseException, JOSEException {
        JWSVerifier verifier = new MACVerifier(SIGNER_KEY.getBytes())  ;

        SignedJWT signedJWT = SignedJWT.parse(token) ;

        Date expiryTime = (isRefresh)
                ? new Date(signedJWT.getJWTClaimsSet().getIssueTime()
                .toInstant().plus(REFRESHABLE_DURATION , ChronoUnit.SECONDS).toEpochMilli())
                :
                signedJWT.getJWTClaimsSet().getExpirationTime() ;

        var verified = signedJWT.verify(verifier) ;

        if(!(verified && expiryTime.after(new Date()))){
            throw new AppException(ErrorCode.UNAUTHORIZED) ;
        }
        if(invalidatedTokenRepository
                .existsById(signedJWT.getJWTClaimsSet().getJWTID()
                )){
            throw new AppException(ErrorCode.UNAUTHORIZED) ;
        }

        return signedJWT ;
    }

    @Override
    public AuthenticationResponse register(UserCreationRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new AppException(ErrorCode.USER_EXISTS);
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new AppException(ErrorCode.EMAIL_EXISTS);
        }
        HashSet<String> roles = new HashSet<>();
        roles.add(Role.USER.name());
        
        // Generate verification token
        String verificationToken = UUID.randomUUID().toString();
        
        User user = User.builder()
                .username(request.getUsername())
                .fullName(request.getFullName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .dob(request.getDob())
                .gender(request.getGender())
                .roles(roles)
                .build();
        userRepository.save(user) ;
        String accessToken = generateAccessToken(user) ;
        String refreshToken = generateRefreshToken(user) ;

            return AuthenticationResponse.builder()
                    .accessToken(accessToken)
                    .refreshToken(refreshToken)
                    .authenticated(true)
                    .build();
    
    }

   

    @Override
    public AuthenticationResponse login(LoginRequest request){

        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND)) ;
        boolean authenticated =  passwordEncoder.matches(request.getPassword() , user.getPassword()) ;
        if(!authenticated){
            throw new AppException(ErrorCode.UNAUTHORIZED) ;
        }
        var accessToken = generateAccessToken(user) ;
        var refreshToken = generateRefreshToken(user) ;
        return AuthenticationResponse.builder()
                .authenticated(true)
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .build() ;
    }

    @Override
    public IntrospectResponse introspect(IntrospectRequest request)
            throws JOSEException , ParseException {
        var token = request.getToken() ;
        boolean isValid = true ;
        try{
            verifyToken(token , false) ;
        }catch(AppException e){
            isValid = false ;
        }
        return IntrospectResponse.builder()
                .valid(isValid)
                .build()
                ;
    }

    @Override
    public void logout(LogoutRequest request) throws ParseException, JOSEException {
        try{
            var token = request.getToken() ;
            var signedJWT = verifyToken(token, true ) ;
            Date expiryTime = signedJWT.getJWTClaimsSet().getExpirationTime() ;
            String jit = signedJWT.getJWTClaimsSet().getJWTID() ;
            InvalidatedToken invalidatedToken = InvalidatedToken.builder()
                    .id(jit)
                    .expiryTime(expiryTime)
                    .build();
            invalidatedTokenRepository.save(invalidatedToken) ;
        }catch(AppException e){
            log.info("Token already expired ") ;
        }

    }

    @Override
    public AuthenticationResponse refreshToken(RefreshRequest request ) throws ParseException, JOSEException {
        var refreshToken = request.getRefreshToken() ;
        var signedJwt = verifyToken(refreshToken , true ) ;

        var jit = signedJwt.getJWTClaimsSet().getJWTID() ;
        var expiryTime = signedJwt.getJWTClaimsSet().getExpirationTime() ;

        InvalidatedToken invalidatedToken = InvalidatedToken.builder()
                .id(jit)
                .expiryTime(expiryTime)
                .build();
        invalidatedTokenRepository.save(invalidatedToken) ;
        var username = signedJwt.getJWTClaimsSet().getSubject() ;
        var user = userRepository.findByUsername(username)
                .orElseThrow(() -> new AppException(ErrorCode.UNAUTHORIZED)) ;
        var newToken = generateAccessToken(user) ;
        var newRefreshToken = generateRefreshToken(user) ;
        return AuthenticationResponse.builder()
                .accessToken(newToken)
                .refreshToken(newRefreshToken)
                .authenticated(true)
                .build() ;

    }

}
