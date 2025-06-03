package com.bookstore.backend.dto;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CouponUsageDto {
    Long id;
    Long couponId;
    String couponCode;
    String couponName;
    Long userId;
    String username;
    Long orderId;
    Double discountAmount;
    LocalDateTime usedAt;
}
