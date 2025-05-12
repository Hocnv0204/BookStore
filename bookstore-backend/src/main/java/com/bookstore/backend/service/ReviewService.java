package com.bookstore.backend.service;

import com.bookstore.backend.dto.ReviewDto;
import com.bookstore.backend.dto.request.ReviewRequest;
import com.bookstore.backend.dto.response.PageResponse;
import com.bookstore.backend.dto.response.ReviewStatsResponse;

public interface ReviewService {
    ReviewDto createReview(Long bookId, ReviewRequest request);
    
    ReviewDto updateReview(Long reviewId, ReviewRequest request);
    
    void deleteReview(Long reviewId);
    
    PageResponse<ReviewDto> getBookReviews(Long bookId, int page, int size);
    
    ReviewStatsResponse getBookReviewStats(Long bookId);
    
    PageResponse<ReviewDto> getUserReviews(Long userId, int page, int size);
} 