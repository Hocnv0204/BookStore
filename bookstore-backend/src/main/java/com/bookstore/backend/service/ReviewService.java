package com.bookstore.backend.service;

import com.bookstore.backend.dto.ReviewDto;
import com.bookstore.backend.dto.request.ReviewRequest;
import com.bookstore.backend.dto.response.PageResponse;
import com.bookstore.backend.dto.response.ReviewStatsResponse;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;

public interface ReviewService {
    ReviewDto createReview(Long orderId , Long bookId, ReviewRequest request, MultipartFile image);
    
    ReviewDto updateReview(Long reviewId, ReviewRequest request, MultipartFile image);
    
    void deleteReview(Long reviewId);
    
    void deleteMultipleReviews(List<Long> reviewIds);
    
    PageResponse<ReviewDto> getBookReviews(Long bookId, Pageable pageable);
    
    ReviewStatsResponse getBookReviewStats(Long bookId);
    
    PageResponse<ReviewDto> getUserReviews(Long userId, Pageable pageable);

    PageResponse<ReviewDto> getAllReviews(Pageable pageable);

    PageResponse<ReviewDto> getReviewsByOrderId(Long orderId, Pageable pageable);

    PageResponse<ReviewDto> searchReviewsByBookTitle(String keyword, Pageable pageable);
} 