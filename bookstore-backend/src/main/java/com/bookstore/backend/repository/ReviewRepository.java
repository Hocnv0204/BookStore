package com.bookstore.backend.repository;

import com.bookstore.backend.model.Review;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    Page<Review> findByBookId(Long bookId, Pageable pageable);
    
    Optional<Review> findByUserIdAndBookId(Long userId, Long bookId);
    
    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.book.id = :bookId")
    Double getAverageRatingByBookId(@Param("bookId") Long bookId);
    
    @Query("SELECT COUNT(r) FROM Review r WHERE r.book.id = :bookId")
    Long countReviewsByBookId(@Param("bookId") Long bookId);
    
    List<Review> findByUserId(Long userId);
    
    boolean existsByUserIdAndBookId(Long userId, Long bookId);

    Page<Review> findByUserId(Long userId, Pageable pageable);

    @Query("SELECT r FROM Review r WHERE LOWER(r.book.title) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    Page<Review> findByBookTitleContainingIgnoreCase(@Param("keyword") String keyword, Pageable pageable);
} 