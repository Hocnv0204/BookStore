package com.bookstore.backend.dto;

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
public class CartDto {
    Long id;
    Long userId;
    String username;
    List<CartItemDto> items;
    Double totalPrice;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;
} 