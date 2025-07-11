package com.bookstore.backend.dto;

import com.bookstore.backend.common.enums.OrderStatus;
import com.bookstore.backend.common.enums.PaymentMethod;
import com.bookstore.backend.common.enums.PaymentStatus;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class OrderDto {
    Long id;
    Long userId;
    String username;
    List<OrderItemDto> items;
    Double totalAmount;
    OrderStatus status;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;
    String deliveryAddress;
    String phoneNumber;
    String email;
    String note;
    String receiverName;
    
    // Payment fields
    PaymentMethod paymentMethod;
    PaymentStatus paymentStatus;
    String paymentTransactionId;
    String paymentUrl;
} 