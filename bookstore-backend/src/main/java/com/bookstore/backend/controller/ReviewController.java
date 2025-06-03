package com.bookstore.backend.controller;

import com.bookstore.backend.dto.ReviewDto;
import com.bookstore.backend.dto.request.ReviewRequest;
import com.bookstore.backend.dto.response.ApiResponse;
import com.bookstore.backend.dto.response.PageResponse;
import com.bookstore.backend.dto.response.ReviewStatsResponse;
import com.bookstore.backend.service.ReviewService;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping
@RequiredArgsConstructor
public class ReviewController {
    private static final int MAX_PAGE_SIZE = 10;
    private final ReviewService reviewService;
    private final ObjectMapper objectMapper;

    @PostMapping(value = "users/reviews/{orderId}/{bookId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ApiResponse<ReviewDto> createReview(
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
        return ApiResponse.<ReviewDto>builder()
                .code(200)
                .message("Review created successfully")
                .result(reviewService.createReview(orderId , bookId, reviewRequest, image))
                .build();
    }

    

    @PutMapping(value = "users/reviews/{reviewId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ApiResponse<ReviewDto> updateReview(
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
        return ApiResponse.<ReviewDto>builder()
                .code(200)
                .message("Review updated successfully")
                .result(reviewService.updateReview(reviewId, reviewRequest, image))
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

    @DeleteMapping("/admin/reviews")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<Void> deleteMultipleReviews(@RequestBody List<Long> reviewIds) {
        reviewService.deleteMultipleReviews(reviewIds);
        return ApiResponse.<Void>builder()
                .code(200)
                .message("Reviews deleted successfully")
                .build();
    }

    @GetMapping("/api/v1/reviews/{bookId}")
    public ResponseEntity<PageResponse<ReviewDto>> getBookReviews(
            @PathVariable Long bookId,
            @RequestParam(value = "page", required = false) Integer page,
            @RequestParam(value = "size", required = false) Integer size,
            @RequestParam(value = "sortBy", required = false) String sortBy,
            @RequestParam(value = "sortOrder", required = false) String sortDirection) {
        Pageable pageable = getPageable(page, size, sortBy, sortDirection);
        return ResponseEntity.ok(reviewService.getBookReviews(bookId , pageable));
    }

    @GetMapping("/api/v1/reviews/stats/{bookId}")
    public ApiResponse<ReviewStatsResponse> getBookReviewStats(@PathVariable Long bookId) {
        return ApiResponse.<ReviewStatsResponse>builder()
                .code(200)
                .message("Book review stats retrieved successfully")
                .result(reviewService.getBookReviewStats(bookId))
                .build();
    }

    @GetMapping("/users/reviews/{userId}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ApiResponse<PageResponse<ReviewDto>> getUserReviews(
            @PathVariable Long userId,
            @RequestParam(value = "page", required = false) Integer page,
            @RequestParam(value = "size", required = false) Integer size,
            @RequestParam(value = "sortBy", required = false) String sortBy,
            @RequestParam(value = "sortOrder", required = false) String sortDirection) {
        Pageable pageable = getPageable(page, size, sortBy, sortDirection);
        return ApiResponse.<PageResponse<ReviewDto>>builder()
                .code(200)
                .message("User reviews retrieved successfully")
                .result(reviewService.getUserReviews(userId, pageable))
                .build();
    }

    @GetMapping("/users/reviews/orders/{orderId}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ApiResponse<PageResponse<ReviewDto>> getReviewsByOrderId(
            @PathVariable Long orderId,
            @RequestParam(value = "page", required = false) Integer page,
            @RequestParam(value = "size", required = false) Integer size,
            @RequestParam(value = "sortBy", required = false) String sortBy,
            @RequestParam(value = "sortOrder", required = false) String sortDirection) {
        Pageable pageable = getPageable(page, size, sortBy, sortDirection);
        return ApiResponse.<PageResponse<ReviewDto>>builder()
                .code(200)
                .message("Reviews by order ID retrieved successfully")
                .result(reviewService.getReviewsByOrderId(orderId, pageable))
                .build();
    }

    @GetMapping("/admin/reviews")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<PageResponse<ReviewDto>> getAllReviews(
            @RequestParam(value = "page", required = false) Integer page,
            @RequestParam(value = "size", required = false) Integer size,
            @RequestParam(value = "sortBy", required = false) String sortBy,
            @RequestParam(value = "sortOrder", required = false) String sortDirection) {
        Pageable pageable = getPageable(page, size, sortBy, sortDirection);
        return ApiResponse.<PageResponse<ReviewDto>>builder()
                .code(200)
                .message("All reviews retrieved successfully")
                .result(reviewService.getAllReviews(pageable))
                .build();
    }

    @GetMapping("/admin/reviews/search")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<PageResponse<ReviewDto>> searchReviewsByBookTitle(
            @RequestParam(required = false) String keyword,
            @RequestParam(value = "page", required = false) Integer page,
            @RequestParam(value = "size", required = false) Integer size,
            @RequestParam(value = "sortBy", required = false) String sortBy,
            @RequestParam(value = "sortOrder", required = false) String sortDirection) {
        Pageable pageable = getPageable(page, size, sortBy, sortDirection);
        return ApiResponse.<PageResponse<ReviewDto>>builder()
                .code(200)
                .message("Reviews search results")
                .result(reviewService.searchReviewsByBookTitle(keyword, pageable))
                .build();
    }

    private Pageable getPageable(Integer page, Integer size, String sortBy, String sortDirection) {
        int pageNumber = (page != null) ? page : 0;
        int pageSize = (size != null) ? Math.min(size, MAX_PAGE_SIZE) : 10;
        String sortField = (sortBy != null) ? sortBy : "id";
        Sort.Direction direction = (sortDirection != null) ? Sort.Direction.fromString(sortDirection) : Sort.Direction.ASC;
        return PageRequest.of(pageNumber, pageSize, Sort.by(direction, sortField));
    }
} 