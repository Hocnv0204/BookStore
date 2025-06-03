package com.bookstore.backend.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CouponValidationResponse {
    Boolean isValid;
    String message;
    Double discountAmount;
    Double finalAmount;
    String couponCode;
    String couponName;
}
