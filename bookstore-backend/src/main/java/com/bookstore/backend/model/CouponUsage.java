package com.bookstore.backend.model;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Entity
@Table(name = "coupon_usages", 
       uniqueConstraints = @UniqueConstraint(columnNames = {"coupon_id", "user_id", "order_id"}))
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CouponUsage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "coupon_id", nullable = false)
    Coupon coupon;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    Order order;

    @Column(nullable = false)
    Double discountAmount; // Số tiền thực tế được giảm

    @Column(nullable = false)
    LocalDateTime usedAt;

    @PrePersist
    protected void onCreate() {
        usedAt = LocalDateTime.now();
    }
}
