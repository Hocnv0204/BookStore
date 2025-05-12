package com.bookstore.backend.controller;

import com.bookstore.backend.dto.CartDto;
import com.bookstore.backend.dto.request.CartItemRequest;
import com.bookstore.backend.dto.response.ApiResponse;
import com.bookstore.backend.dto.response.PageResponse;
import com.bookstore.backend.service.CartService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
public class CartController {
    private final CartService cartService;
    private static final int MAX_PAGE_SIZE = 20;

    @GetMapping("users/cart")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<PageResponse<CartDto>> getCart(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "price") String sortBy,
            @RequestParam(defaultValue = "asc") String sortOrder) {
        size = Math.min(size, MAX_PAGE_SIZE);
        Pageable pageable = PageRequest.of(page, size, 
                Sort.Direction.fromString(sortOrder), sortBy);
        return ResponseEntity.ok(cartService.getCart(pageable));
    }

    @PostMapping("users/cart/items")
    @PreAuthorize("hasRole('USER')")
    public ApiResponse<CartDto> addItem(@RequestBody @Valid CartItemRequest request) {
        return ApiResponse.<CartDto>builder()
                .code(200)
                .message("Item added to cart successfully")
                .result(cartService.addItem(request))
                .build();
    }

    @PutMapping("users/cart/items/{bookId}")
    @PreAuthorize("hasRole('USER')")
    public ApiResponse<CartDto> updateItemQuantity(
            @PathVariable Long bookId,
            @RequestParam Integer quantity) {
        return ApiResponse.<CartDto>builder()
                .code(200)
                .message("Item quantity updated successfully")
                .result(cartService.updateItemQuantity(bookId, quantity))
                .build();
    }

    @DeleteMapping("users/cart/items/{bookId}")
    @PreAuthorize("hasRole('USER')")
    public ApiResponse<CartDto> removeItem(@PathVariable Long bookId) {
        return ApiResponse.<CartDto>builder()
                .code(200)
                .message("Item removed from cart successfully")
                .result(cartService.removeItem(bookId))
                .build();
    }

    // Admin endpoints
    @GetMapping("/admin/carts")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PageResponse<CartDto>> getAllCarts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortOrder) {
        size = Math.min(size, MAX_PAGE_SIZE);
        Pageable pageable = PageRequest.of(page, size, 
                Sort.Direction.fromString(sortOrder), sortBy);
        return ResponseEntity.ok(cartService.getAllCarts(pageable));
    }

    @GetMapping("/admin/carts/count")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<Long> getTotalCarts() {
        return ApiResponse.<Long>builder()
                .code(200)
                .message("Total carts retrieved successfully")
                .result(cartService.getTotalCarts())
                .build();
    }

    @GetMapping("/admin/books/{bookId}/cart-count")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<Long> getBookCartCount(@PathVariable Long bookId) {
        return ApiResponse.<Long>builder()
                .code(200)
                .message("Book cart count retrieved successfully")
                .result(cartService.getBookCartCount(bookId))
                .build();
    }
} 