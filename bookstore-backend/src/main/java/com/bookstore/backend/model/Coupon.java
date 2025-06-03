package com.bookstore.backend.model;

import com.bookstore.backend.common.enums.CouponStatus;
import com.bookstore.backend.common.enums.DiscountType;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Entity
@Table(name = "coupons")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Coupon {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @Column(nullable = false, unique = true, length = 50)
    String code; // Mã giảm giá (VD: SUMMER2024)

    @Column(nullable = false, length = 200)
    String name; // Tên chương trình giảm giá

    @Column(length = 500)
    String description; // Mô tả chi tiết

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    DiscountType discountType; // PERCENTAGE hoặc FIXED_AMOUNT

    @Column(nullable = false)
    Double discountValue; // Giá trị giảm (% hoặc số tiền)

    @Column
    Double maxDiscountAmount; // Số tiền giảm tối đa (chỉ áp dụng cho PERCENTAGE)

    @Column
    Double minimumOrderAmount; // Giá trị đơn hàng tối thiểu để áp dụng

    @Column(nullable = false)
    Integer totalUsageLimit; // Tổng số lượt sử dụng cho phép

    @Column(nullable = false)
    @Builder.Default
    Integer usedCount = 0; // Số lượt đã sử dụng

    @Column
    Integer userUsageLimit; // Giới hạn số lần sử dụng cho mỗi user (null = không giới hạn)

    @Column(nullable = false)
    LocalDateTime startDate; // Ngày bắt đầu hiệu lực

    @Column(nullable = false)
    LocalDateTime endDate; // Ngày hết hạn

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    @Builder.Default
    CouponStatus status = CouponStatus.ACTIVE; // Trạng thái mã giảm giá

    @Column(nullable = false)
    LocalDateTime createdAt;

    @Column(nullable = false)
    LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // Kiểm tra mã còn hiệu lực không
    public boolean isValid() {
        LocalDateTime now = LocalDateTime.now();
        return status == CouponStatus.ACTIVE 
            && now.isAfter(startDate) 
            && now.isBefore(endDate)
            && usedCount < totalUsageLimit;
    }

    // Tính toán số tiền giảm
    public Double calculateDiscount(Double orderAmount) {
        if (!isValid() || orderAmount < (minimumOrderAmount != null ? minimumOrderAmount : 0)) {
            return 0.0;
        }

        Double discount = 0.0;
        if (discountType == DiscountType.PERCENTAGE) {
            discount = orderAmount * (discountValue / 100);
            if (maxDiscountAmount != null && discount > maxDiscountAmount) {
                discount = maxDiscountAmount;
            }
        } else { // FIXED_AMOUNT
            discount = discountValue;
            if (discount > orderAmount) {
                discount = orderAmount; // Không được giảm quá tổng tiền đơn hàng
            }
        }
        
        return discount;
    }
}
