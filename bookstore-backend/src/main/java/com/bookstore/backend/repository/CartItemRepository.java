package com.bookstore.backend.repository;

import com.bookstore.backend.model.CartItem;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    Optional<CartItem> findByCartIdAndBookId(Long cartId, Long bookId);
    
    void deleteByCartIdAndBookId(Long cartId, Long bookId);
    
    void deleteByCartId(Long cartId);
    
    Page<CartItem> findByCartId(Long cartId, Pageable pageable);
} 