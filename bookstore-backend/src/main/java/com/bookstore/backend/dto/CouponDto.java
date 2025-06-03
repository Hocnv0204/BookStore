package com.bookstore.backend.dto;

import com.bookstore.backend.common.enums.CouponStatus;
import com.bookstore.backend.common.enums.DiscountType;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CouponDto {
    Long id;
    String code;
    String name;
    String description;
    DiscountType discountType;
    Double discountValue;
    Double maxDiscountAmount;
    Double minimumOrderAmount;
    Integer totalUsageLimit;
    Integer usedCount;
    Integer userUsageLimit;
    LocalDateTime startDate;
    LocalDateTime endDate;
    CouponStatus status;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;
    
    // Additional computed fields
    Boolean isValid;
    Integer remainingUsage;
    Double totalDiscountAmount; // Tổng số tiền đã giảm
}
