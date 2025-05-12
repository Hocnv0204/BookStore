package com.bookstore.backend.dto.response;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReviewStatsResponse {
    private Long totalReviews;
    private Double averageRating;
    private Long bookId;
    private String bookTitle;
} 