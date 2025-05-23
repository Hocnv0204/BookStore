package com.bookstore.backend.repository;

import com.bookstore.backend.model.VerificationCode;
import com.bookstore.backend.common.enums.VerificationType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import java.util.Optional;

public interface VerificationCodeRepository extends JpaRepository<VerificationCode, Long> {
    Optional<VerificationCode> findByEmailAndCodeAndTypeAndUsedFalse(String email, String code, VerificationType type);
    @Modifying
    void deleteByEmailAndType(String email, VerificationType type);
} 