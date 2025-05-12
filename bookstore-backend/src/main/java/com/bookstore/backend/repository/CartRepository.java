package com.bookstore.backend.repository;

import com.bookstore.backend.model.Cart;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CartRepository extends JpaRepository<Cart, Long> {
    Optional<Cart> findByUserId(Long userId);
    Page<Cart> findAll(Pageable pageable);
    
    @Query("SELECT COUNT(c) FROM Cart c")
    Long countTotalCarts();
    
    @Query("SELECT COUNT(ci) FROM CartItem ci WHERE ci.book.id = :bookId")
    Long countBookInCarts(@Param("bookId") Long bookId);
} 