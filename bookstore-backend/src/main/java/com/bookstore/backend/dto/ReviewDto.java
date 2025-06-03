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
public class ReviewDto {
    Long id;
    Long userId;
    String username;
    Long bookId;
    String bookTitle;
    Integer rating;
    String comment;
    String imageUrl;
    Long orderId;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;
} 