package com.bookstore.backend.model;

import com.bookstore.backend.common.enums.OrderStatus;
import com.bookstore.backend.common.enums.PaymentMethod;
import com.bookstore.backend.common.enums.PaymentStatus;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "orders")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    User user;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    List<OrderItem> items = new ArrayList<>();

    @Column(nullable = false)
    Double totalAmount;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    OrderStatus status;

    @Column(nullable = false)
    String receiverName;

    @Column(nullable = false)
    String deliveryAddress;

    @Column(nullable = false)
    String phoneNumber;

    @Column(nullable = false)
    String email; 

    @Column
    String note;

    // Payment related fields
    @Column
    @Enumerated(EnumType.STRING)
    PaymentMethod paymentMethod; // CASH, VNPAY, MOMO
    
    @Column
    @Enumerated(EnumType.STRING)
    PaymentStatus paymentStatus; // PENDING, PAID, FAILED, REFUNDED
    
    @Column(length = 100)
    String paymentTransactionId; // ID từ payment gateway
    
    @Column(length = 1000)
    String paymentUrl; // URL thanh toán từ VNPay (increased length for long URLs)

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
} 