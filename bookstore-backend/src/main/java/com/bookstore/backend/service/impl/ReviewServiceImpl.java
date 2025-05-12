package com.bookstore.backend.service.impl;

import com.bookstore.backend.dto.ReviewDto;
import com.bookstore.backend.dto.request.ReviewRequest;
import com.bookstore.backend.dto.response.PageResponse;
import com.bookstore.backend.dto.response.ReviewStatsResponse;
import com.bookstore.backend.exception.AppException;
import com.bookstore.backend.common.enums.ErrorCode;
import com.bookstore.backend.mapper.ReviewMapper;
import com.bookstore.backend.model.Book;
import com.bookstore.backend.model.Review;
import com.bookstore.backend.model.User;
import com.bookstore.backend.repository.BookRepository;
import com.bookstore.backend.repository.ReviewRepository;
import com.bookstore.backend.repository.UserRepository;
import com.bookstore.backend.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ReviewServiceImpl implements ReviewService {
    private final ReviewRepository reviewRepository;
    private final UserRepository userRepository;
    private final BookRepository bookRepository;
    private final ReviewMapper reviewMapper;

    private String getCurrentUsername() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }
        return authentication.getName();
    }

    private User getCurrentUser() {
        return userRepository.findByUsername(getCurrentUsername())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
    }

    @Override
    @Transactional
    public ReviewDto createReview(Long bookId, ReviewRequest request) {
        User user = getCurrentUser();
        
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new AppException(ErrorCode.BOOK_NOT_FOUND));

        if (reviewRepository.existsByUserIdAndBookId(user.getId(), bookId)) {
            throw new AppException(ErrorCode.REVIEW_ALREADY_EXISTS);
        }

        Review review = Review.builder()
                .user(user)
                .book(book)
                .rating(request.getRating())
                .comment(request.getComment())
                .build();

        return reviewMapper.toDto(reviewRepository.save(review));
    }

    @Override
    @Transactional
    public ReviewDto updateReview(Long reviewId, ReviewRequest request) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new AppException(ErrorCode.REVIEW_NOT_FOUND));

        User currentUser = getCurrentUser();
        if (!review.getUser().getId().equals(currentUser.getId())) {
            throw new AppException(ErrorCode.REVIEW_NOT_FOUND);
        }

        reviewMapper.updateReview(review, request);
        return reviewMapper.toDto(reviewRepository.save(review));
    }

    @Override
    @Transactional
    public void deleteReview(Long reviewId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new AppException(ErrorCode.REVIEW_NOT_FOUND));

        User currentUser = getCurrentUser();
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        boolean isAdmin = auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

        if (!review.getUser().getId().equals(currentUser.getId()) && !isAdmin) {
            throw new AppException(ErrorCode.REVIEW_NOT_FOUND);
        }

        reviewRepository.delete(review);
    }

    @Override
    public PageResponse<ReviewDto> getBookReviews(Long bookId, int page, int size) {
        if (!bookRepository.existsById(bookId)) {
            throw new AppException(ErrorCode.BOOK_NOT_FOUND);
        }

        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Review> reviews = reviewRepository.findByBookId(bookId, pageable);

        return PageResponse.<ReviewDto>builder()
                .content(reviews.getContent().stream().map(reviewMapper::toDto).toList())
                .pageNumber(page)
                .pageSize(size)
                .totalElements(reviews.getTotalElements())
                .totalPages(reviews.getTotalPages())
                .isLast(reviews.isLast())
                .build();
    }

    @Override
    public ReviewStatsResponse getBookReviewStats(Long bookId) {
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new AppException(ErrorCode.BOOK_NOT_FOUND));

        Long totalReviews = reviewRepository.countReviewsByBookId(bookId);
        Double averageRating = reviewRepository.getAverageRatingByBookId(bookId);

        return ReviewStatsResponse.builder()
                .totalReviews(totalReviews)
                .averageRating(averageRating != null ? averageRating : 0.0)
                .bookId(book.getId())
                .bookTitle(book.getTitle())
                .build();
    }

    @Override
    public PageResponse<ReviewDto> getUserReviews(Long userId, int page, int size) {
        if (!userRepository.existsById(userId)) {
            throw new AppException(ErrorCode.USER_NOT_FOUND);
        }

        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Review> reviews = reviewRepository.findByUserId(userId, pageable);

        return PageResponse.<ReviewDto>builder()
                .content(reviews.getContent().stream().map(reviewMapper::toDto).toList())
                .pageNumber(page)
                .pageSize(size)
                .totalElements(reviews.getTotalElements())
                .totalPages(reviews.getTotalPages())
                .isLast(reviews.isLast())
                .build();
    }
} 