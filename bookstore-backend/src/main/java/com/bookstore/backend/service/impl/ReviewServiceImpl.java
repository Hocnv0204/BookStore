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
import com.bookstore.backend.repository.OrderRepository;
import com.bookstore.backend.repository.ReviewRepository;
import com.bookstore.backend.repository.UserRepository;
import com.bookstore.backend.service.FileStorageService;
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
import org.springframework.web.multipart.MultipartFile;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReviewServiceImpl implements ReviewService {
    private final ReviewRepository reviewRepository;
    private final UserRepository userRepository;
    private final BookRepository bookRepository;
    private final OrderRepository orderRepository;
    private final ReviewMapper reviewMapper;
    private final FileStorageService fileStorageService;

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
    public ReviewDto createReview(Long bookId, ReviewRequest request, MultipartFile image) {
        User user = getCurrentUser();
        
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new AppException(ErrorCode.BOOK_NOT_FOUND));

        // Check if user has purchased the book
        if (!orderRepository.hasUserPurchasedBook(user.getId(), bookId)) {
            throw new AppException(ErrorCode.REVIEW_NOT_ALLOWED);
        }

        // Check if user has already reviewed this book
        Review existingReview = reviewRepository.findByUserIdAndBookId(user.getId(), bookId)
                .orElse(null);

        String imageUrl = null;
        if (image != null && !image.isEmpty()) {
            imageUrl = fileStorageService.storeFile(image, "reviews");
        }

        if (existingReview != null) {
            // Delete old image if exists and new image is provided
            if (image != null && !image.isEmpty() && existingReview.getImageUrl() != null) {
                fileStorageService.deleteFile(existingReview.getImageUrl(), "reviews");
            }
            
            existingReview.setRating(request.getRating());
            existingReview.setComment(request.getComment());
            if (imageUrl != null) {
                existingReview.setImageUrl(imageUrl);
            }
            return reviewMapper.toDto(reviewRepository.save(existingReview));
        }

        // Create new review
        Review review = Review.builder()
                .user(user)
                .book(book)
                .rating(request.getRating())
                .comment(request.getComment())
                .imageUrl(imageUrl)
                .build();

        return reviewMapper.toDto(reviewRepository.save(review));
    }

    @Override
    @Transactional
    public ReviewDto updateReview(Long reviewId, ReviewRequest request, MultipartFile image) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new AppException(ErrorCode.REVIEW_NOT_FOUND));

        User currentUser = getCurrentUser();
        if (!review.getUser().getId().equals(currentUser.getId())) {
            throw new AppException(ErrorCode.REVIEW_NOT_FOUND);
        }

        // Handle image upload
        if (image != null && !image.isEmpty()) {
            // Delete old image if exists
            if (review.getImageUrl() != null) {
                fileStorageService.deleteFile(review.getImageUrl(), "reviews");
            }
            // Store new image
            String imageUrl = fileStorageService.storeFile(image, "reviews");
            review.setImageUrl(imageUrl);
        }

        review.setRating(request.getRating());
        review.setComment(request.getComment());
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

        // Delete review image if exists
        if (review.getImageUrl() != null) {
            fileStorageService.deleteFile(review.getImageUrl(), "reviews");
        }

        reviewRepository.delete(review);
    }

    @Override
    @Transactional
    public void deleteMultipleReviews(List<Long> reviewIds) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        boolean isAdmin = auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

        if (!isAdmin) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        List<Review> reviews = reviewRepository.findAllById(reviewIds);
        
        // Delete all review images
        for (Review review : reviews) {
            if (review.getImageUrl() != null) {
                fileStorageService.deleteFile(review.getImageUrl(), "reviews");
            }
        }

        reviewRepository.deleteAllById(reviewIds);
    }

    @Override
    public PageResponse<ReviewDto> getBookReviews(Long bookId, Pageable pageable) {
        if (!bookRepository.existsById(bookId)) {
            throw new AppException(ErrorCode.BOOK_NOT_FOUND);
        }

        return createPageResponse(reviewRepository.findByBookId(bookId, pageable));
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
    public PageResponse<ReviewDto> getUserReviews(Long userId, Pageable pageable) {
        if (!userRepository.existsById(userId)) {
            throw new AppException(ErrorCode.USER_NOT_FOUND);
        }
       return createPageResponse(reviewRepository.findByUserId(userId, pageable));
    }

    @Override
    public PageResponse<ReviewDto> getAllReviews(Pageable pageable) {
        return createPageResponse(reviewRepository.findAll(pageable));
    }

    @Override
    public PageResponse<ReviewDto> searchReviewsByBookTitle(String keyword, Pageable pageable) {
        if (keyword == null || keyword.trim().isEmpty()) {
            return getAllReviews(pageable);
        }
        return createPageResponse(reviewRepository.findByBookTitleContainingIgnoreCase(keyword.trim(), pageable));
    }

    private PageResponse<ReviewDto> createPageResponse(Page<Review> reviewPage) {
        return PageResponse.<ReviewDto>builder()
                .content(reviewPage.getContent().stream()
                        .map(reviewMapper::toDto)
                        .collect(Collectors.toList()))
                .totalElements(reviewPage.getTotalElements())
                .totalPages(reviewPage.getTotalPages())
                .pageNumber(reviewPage.getNumber())
                .pageSize(reviewPage.getSize())
                .isLast(reviewPage.isLast())
                .build();
    }
} 