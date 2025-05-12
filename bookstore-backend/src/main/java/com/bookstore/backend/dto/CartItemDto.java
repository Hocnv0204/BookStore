package com.bookstore.backend.dto;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CartItemDto {
    Long id;
    Long bookId;
    String bookTitle;
    String bookImage;
    Integer quantity;
    Double price;
    Double subtotal;
} 