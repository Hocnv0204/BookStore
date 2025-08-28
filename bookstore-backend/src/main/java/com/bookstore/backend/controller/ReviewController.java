package com.bookstore.backend.controller;

import com.bookstore.backend.dto.ReviewDto;
import com.bookstore.backend.dto.request.ReviewRequest;
import com.bookstore.backend.dto.response.ApiResponse;
import com.bookstore.backend.dto.response.PageResponse;
import com.bookstore.backend.dto.response.ReviewStatsResponse;
import com.bookstore.backend.service.ReviewService;
import com.bookstore.backend.utils.PageableUtils;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {
    private final ReviewService reviewService;
    private final ObjectMapper objectMapper;

    @PostMapping(value = "/users/{orderId}/{bookId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<ApiResponse<?>> createReview(
            @PathVariable Long bookId,
            @PathVariable Long orderId,
            @RequestPart("request") String request,
            @RequestPart(value = "image", required = false) MultipartFile image,
            Authentication authentication) {
        ReviewRequest reviewRequest = null;
        try {
            reviewRequest = objectMapper.readValue(request, ReviewRequest.class);
        } catch (Exception e) {
            throw new RuntimeException("Invalid request body");
        }
        ReviewDto review = reviewService.createReview(orderId, bookId, reviewRequest, image);
        return ResponseEntity.ok(
                ApiResponse.builder()
                        .data(review)
                        .message("Review created successfully")
                        .build()
        );
    }

    @PutMapping(value = "/users/{reviewId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<ApiResponse<?>> updateReview(
            @PathVariable Long reviewId,
            @RequestPart("request") String request,
            @RequestPart(value = "image", required = false) MultipartFile image,
            Authentication authentication) {
        ReviewRequest reviewRequest = null;
        try {
            reviewRequest = objectMapper.readValue(request, ReviewRequest.class);
        } catch (Exception e) {
            throw new RuntimeException("Invalid request body");
        }
        ReviewDto review = reviewService.updateReview(reviewId, reviewRequest, image);
        return ResponseEntity.ok(
                ApiResponse.builder()
                        .data(review)
                        .message("Review updated successfully")
                        .build()
        );
    }

    @DeleteMapping("/users/{reviewId}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<ApiResponse<?>> deleteReview(
            @PathVariable Long reviewId,
            Authentication authentication) {
        reviewService.deleteReview(reviewId);
        return ResponseEntity.ok(
                ApiResponse.builder()
                        .data(null)
                        .message("Review deleted successfully")
                        .build()
        );
    }

    @DeleteMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<?>> deleteMultipleReviews(@RequestBody List<Long> reviewIds) {
        reviewService.deleteMultipleReviews(reviewIds);
        return ResponseEntity.ok(
                ApiResponse.builder()
                        .data(null)
                        .message("Reviews deleted successfully")
                        .build()
        );
    }

    @GetMapping("/{bookId}")
    public ResponseEntity<ApiResponse<?>> getBookReviews(
            @PathVariable Long bookId,
            @RequestParam(value = "page", required = false) Integer page,
            @RequestParam(value = "size", required = false) Integer size,
            @RequestParam(value = "sortBy", required = false) String sortBy,
            @RequestParam(value = "sortOrder", required = false) String sortDirection) {
        Pageable pageable = PageableUtils.setPageable(page, size, sortDirection, sortBy);
        PageResponse<ReviewDto> response = reviewService.getBookReviews(bookId, pageable);
        return ResponseEntity.ok(
                ApiResponse.builder()
                        .data(response)
                        .message("Get book reviews")
                        .build()
        );
    }

    @GetMapping("/stats/{bookId}")
    public ResponseEntity<ApiResponse<?>> getBookReviewStats(@PathVariable Long bookId) {
        ReviewStatsResponse stats = reviewService.getBookReviewStats(bookId);
        return ResponseEntity.ok(
                ApiResponse.builder()
                        .data(stats)
                        .message("Book review stats retrieved successfully")
                        .build()
        );
    }

    @GetMapping("/users/{userId}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<ApiResponse<?>> getUserReviews(
            @PathVariable Long userId,
            @RequestParam(value = "page", required = false) Integer page,
            @RequestParam(value = "size", required = false) Integer size,
            @RequestParam(value = "sortBy", required = false) String sortBy,
            @RequestParam(value = "sortOrder", required = false) String sortDirection) {
        Pageable pageable = PageableUtils.setPageable(page, size, sortDirection, sortBy);
        PageResponse<ReviewDto> response = reviewService.getUserReviews(userId, pageable);
        return ResponseEntity.ok(
                ApiResponse.builder()
                        .data(response)
                        .message("User reviews retrieved successfully")
                        .build()
        );
    }

    @GetMapping("/users/orders/{orderId}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<ApiResponse<?>> getReviewsByOrderId(
            @PathVariable Long orderId,
            @RequestParam(value = "page", required = false) Integer page,
            @RequestParam(value = "size", required = false) Integer size,
            @RequestParam(value = "sortBy", required = false) String sortBy,
            @RequestParam(value = "sortOrder", required = false) String sortDirection) {
        Pageable pageable = PageableUtils.setPageable(page, size, sortDirection, sortBy);
        PageResponse<ReviewDto> response = reviewService.getReviewsByOrderId(orderId, pageable);
        return ResponseEntity.ok(
                ApiResponse.builder()
                        .data(response)
                        .message("Reviews by order ID retrieved successfully")
                        .build()
        );
    }

    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<?>> getAllReviews(
            @RequestParam(value = "page", required = false) Integer page,
            @RequestParam(value = "size", required = false) Integer size,
            @RequestParam(value = "sortBy", required = false) String sortBy,
            @RequestParam(value = "sortOrder", required = false) String sortDirection) {
        Pageable pageable = PageableUtils.setPageable(page, size, sortDirection, sortBy);
        PageResponse<ReviewDto> response = reviewService.getAllReviews(pageable);
        return ResponseEntity.ok(
                ApiResponse.builder()
                        .data(response)
                        .message("All reviews retrieved successfully")
                        .build()
        );
    }

    @GetMapping("/admin/search")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<?>> searchReviewsByBookTitle(
            @RequestParam(required = false) String keyword,
            @RequestParam(value = "page", required = false) Integer page,
            @RequestParam(value = "size", required = false) Integer size,
            @RequestParam(value = "sortBy", required = false) String sortBy,
            @RequestParam(value = "sortOrder", required = false) String sortDirection) {
        Pageable pageable = PageableUtils.setPageable(page, size, sortDirection, sortBy);
        PageResponse<ReviewDto> response = reviewService.searchReviewsByBookTitle(keyword, pageable);
        return ResponseEntity.ok(
                ApiResponse.builder()
                        .data(response)
                        .message("Reviews search results")
                        .build()
        );
    }
} 