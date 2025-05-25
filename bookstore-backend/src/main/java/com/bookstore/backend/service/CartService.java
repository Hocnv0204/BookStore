package com.bookstore.backend.service;

import com.bookstore.backend.dto.CartDto;
import com.bookstore.backend.dto.CartItemDto;
import com.bookstore.backend.dto.request.CartItemRequest;
import com.bookstore.backend.dto.response.PageResponse;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface CartService {
    // User methods
    PageResponse<CartDto> getCart(Pageable pageable);
    
    CartDto addItem(CartItemRequest request);
    
    CartDto updateItemQuantity(Long bookId, Integer quantity);
    
    CartDto removeItem(Long bookId);
    
    CartDto getCart();
    
    void clearCart();

    List<CartItemDto> getSelectedCartItems(List<Long> cartItemIds);
    
    void removeSelectedItems(List<Long> cartItemIds);

    // Admin methods
    PageResponse<CartDto> getAllCarts(Pageable pageable);
    
    Long getTotalCarts();
    
    Long getBookCartCount(Long bookId);
} 