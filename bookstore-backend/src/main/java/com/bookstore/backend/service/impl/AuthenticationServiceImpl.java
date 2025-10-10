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
import com.bookstore.backend.service.EmailService;
import com.bookstore.backend.service.NotificationService;
import com.bookstore.backend.repository.VerificationCodeRepository;
import com.bookstore.backend.model.VerificationCode;
import com.bookstore.backend.common.enums.VerificationType;
import org.springframework.transaction.annotation.Transactional;
import java.text.ParseException;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.HashSet;
import java.util.Random;
import java.util.StringJoiner;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j

public class AuthenticationServiceImpl implements AuthenticationService {
    final UserRepository userRepository ;
    private final PasswordEncoder passwordEncoder;
    private final InvalidatedTokenRepository invalidatedTokenRepository ;
    private final EmailService emailService;
    private final VerificationCodeRepository verificationCodeRepository;
    private final NotificationService notificationService;
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
                .claim("scope" , user.getRole())
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
                .claim("scope", user.getRole())
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

    private String generateVerificationCode() {
        return String.format("%06d", new Random().nextInt(1000000));
    }
    @Transactional
    @Override
    public void sendVerificationCode(String email, VerificationType type) {
        if (type == VerificationType.REGISTRATION && userRepository.existsByEmail(email)) {
            throw new AppException(ErrorCode.EMAIL_EXISTS);
        }
        if (type == VerificationType.PASSWORD_RESET && !userRepository.existsByEmail(email)) {
            throw new AppException(ErrorCode.USER_NOT_FOUND);
        }
        verificationCodeRepository.deleteByEmailAndType(email, type);
        String code = generateVerificationCode();
        LocalDateTime expiryTime = LocalDateTime.now().plusMinutes(15);
        VerificationCode verificationCode = VerificationCode.builder()
                .email(email)
                .code(code)
                .expiryTime(expiryTime)
                .used(false)
                .type(type)
                .build();
        verificationCodeRepository.save(verificationCode);
        if (type == VerificationType.REGISTRATION) {
            emailService.sendVerificationEmail(email, code);
        } else if (type == VerificationType.PASSWORD_RESET) {
            emailService.sendPasswordResetEmail(email, code);
        }
    }

    @Override
    public AuthenticationResponse verifyAndRegister(VerifyAndRegisterRequest request) {
        // Verify code
        VerificationCode verificationCode = verificationCodeRepository
                .findByEmailAndCodeAndTypeAndUsedFalse(request.getEmail(), request.getVerificationCode(), VerificationType.REGISTRATION)
                .orElseThrow(() -> new AppException(ErrorCode.INVALID_TOKEN));

        if (verificationCode.getExpiryTime().isBefore(LocalDateTime.now())) {
            throw new AppException(ErrorCode.TOKEN_EXPIRED);
        }


        User user = User.builder()
                .username(request.getUsername())
                .fullName(request.getFullName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .gender(request.getGender())
                .role(Role.USER.toString())
                .build();
        userRepository.save(user);

        // Create notification for new user registration
        notificationService.createNewUserRegistrationNotification(user);

        // Mark verification code as used
        verificationCode.setUsed(true);
        verificationCodeRepository.save(verificationCode);

        // Generate tokens
        String accessToken = generateAccessToken(user);
        String refreshToken = generateRefreshToken(user);

        return AuthenticationResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .authenticated(true)
                .build();
    }

    @Override
    public void resetPassword(ResetPasswordRequest request) {
        VerificationCode verificationCode = verificationCodeRepository
                .findByEmailAndCodeAndTypeAndUsedFalse(request.getEmail(), request.getVerificationCode(), VerificationType.PASSWORD_RESET)
                .orElseThrow(() -> new AppException(ErrorCode.INVALID_TOKEN));

        if (verificationCode.getExpiryTime().isBefore(LocalDateTime.now())) {
            throw new AppException(ErrorCode.TOKEN_EXPIRED);
        }
        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new AppException(ErrorCode.PASSWORD_MISMATCH);
        }
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
        verificationCode.setUsed(true);
        verificationCodeRepository.save(verificationCode);
    }

}
