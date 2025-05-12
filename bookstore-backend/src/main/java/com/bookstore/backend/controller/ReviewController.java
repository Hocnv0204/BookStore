package com.bookstore.backend.controller;

import com.bookstore.backend.dto.ReviewDto;
import com.bookstore.backend.dto.request.ReviewRequest;
import com.bookstore.backend.dto.response.ApiResponse;
import com.bookstore.backend.dto.response.PageResponse;
import com.bookstore.backend.dto.response.ReviewStatsResponse;
import com.bookstore.backend.service.ReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping
@RequiredArgsConstructor
public class ReviewController {
    private final ReviewService reviewService;

    @PostMapping("users/reviews/{bookId}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ApiResponse<ReviewDto> createReview(
            @PathVariable Long bookId,
            @RequestBody @Valid ReviewRequest request,
            Authentication authentication) {
        return ApiResponse.<ReviewDto>builder()
                .code(200)
                .message("Review created successfully")
                .result(reviewService.createReview(bookId, request))
                .build();
    }

    @PutMapping("users/reviews/{reviewId}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ApiResponse<ReviewDto> updateReview(
            @PathVariable Long reviewId,
            @RequestBody @Valid ReviewRequest request,
            Authentication authentication) {
        return ApiResponse.<ReviewDto>builder()
                .code(200)
                .message("Review updated successfully")
                .result(reviewService.updateReview(reviewId, request))
                .build();
    }

    @DeleteMapping("users/reviews/{reviewId}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ApiResponse<Void> deleteReview(
            @PathVariable Long reviewId,
            Authentication authentication) {
        reviewService.deleteReview(reviewId);
        return ApiResponse.<Void>builder()
                .code(200)
                .message("Review deleted successfully")
                .build();
    }

    @GetMapping("/api/v1/reviews/{bookId}")
    public ApiResponse<PageResponse<ReviewDto>> getBookReviews(
            @PathVariable Long bookId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ApiResponse.<PageResponse<ReviewDto>>builder()
                .code(200)
                .message("Book reviews retrieved successfully")
                .result(reviewService.getBookReviews(bookId, page, size))
                .build();
    }

    @GetMapping("/api/v1/reviews/stats/{bookId}")
    public ApiResponse<ReviewStatsResponse> getBookReviewStats(@PathVariable Long bookId) {
        return ApiResponse.<ReviewStatsResponse>builder()
                .code(200)
                .message("Book review stats retrieved successfully")
                .result(reviewService.getBookReviewStats(bookId))
                .build();
    }

    @GetMapping("/admin/reviews/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<PageResponse<ReviewDto>> getUserReviews(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ApiResponse.<PageResponse<ReviewDto>>builder()
                .code(200)
                .message("User reviews retrieved successfully")
                .result(reviewService.getUserReviews(userId, page, size))
                .build();
    }
} 