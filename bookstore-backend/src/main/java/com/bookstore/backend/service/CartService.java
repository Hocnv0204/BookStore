package com.bookstore.backend.service;

import com.bookstore.backend.dto.CartDto;
import com.bookstore.backend.dto.request.CartItemRequest;
import com.bookstore.backend.dto.response.PageResponse;
import org.springframework.data.domain.Pageable;

public interface CartService {
    // User methods
    PageResponse<CartDto> getCart(Pageable pageable);
    
    CartDto addItem(CartItemRequest request);
    
    CartDto updateItemQuantity(Long bookId, Integer quantity);
    
    CartDto removeItem(Long bookId);
    
    CartDto getCart();
    
    void clearCart();
    
    // Admin methods
    PageResponse<CartDto> getAllCarts(Pageable pageable);
    
    Long getTotalCarts();
    
    Long getBookCartCount(Long bookId);
} 