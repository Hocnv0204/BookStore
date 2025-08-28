package com.bookstore.backend.controller;

import com.bookstore.backend.dto.CartDto;
import com.bookstore.backend.dto.request.CartItemRequest;
import com.bookstore.backend.dto.response.ApiResponse;
import com.bookstore.backend.dto.response.PageResponse;
import com.bookstore.backend.service.CartService;
import com.bookstore.backend.utils.PageableUtils;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/carts")
public class CartController {
    private final CartService cartService;

    @GetMapping("/users")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ApiResponse<?>> getCart(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "price") String sortBy,
            @RequestParam(defaultValue = "asc") String sortOrder) {
        Pageable pageable = PageableUtils.setPageable(page, size, sortOrder, sortBy);
        PageResponse<CartDto> response = cartService.getCart(pageable);
        return ResponseEntity.ok(
                ApiResponse.builder()
                        .data(response)
                        .message("Get user cart")
                        .build()
        );
    }

    @PostMapping("/users/items")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ApiResponse<?>> addItem(@RequestBody @Valid CartItemRequest request) {
        CartDto cart = cartService.addItem(request);
        return ResponseEntity.ok(
                ApiResponse.builder()
                        .data(cart)
                        .message("Item added to cart successfully")
                        .build()
        );
    }

    @PutMapping("/users/items/{bookId}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ApiResponse<?>> updateItemQuantity(
            @PathVariable Long bookId,
            @RequestParam Integer quantity) {
        CartDto cart = cartService.updateItemQuantity(bookId, quantity);
        return ResponseEntity.ok(
                ApiResponse.builder()
                        .data(cart)
                        .message("Item quantity updated successfully")
                        .build()
        );
    }

    @DeleteMapping("/users/items/{bookId}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ApiResponse<?>> removeItem(@PathVariable Long bookId) {
        CartDto cart = cartService.removeItem(bookId);
        return ResponseEntity.ok(
                ApiResponse.builder()
                        .data(cart)
                        .message("Item removed from cart successfully")
                        .build()
        );
    }

    // Admin endpoints
    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<?>> getAllCarts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortOrder) {
        Pageable pageable = PageableUtils.setPageable(page, size, sortOrder, sortBy);
        PageResponse<CartDto> response = cartService.getAllCarts(pageable);
        return ResponseEntity.ok(
                ApiResponse.builder()
                        .data(response)
                        .message("Get all carts")
                        .build()
        );
    }

    @GetMapping("/admin/count")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<?>> getTotalCarts() {
        Long count = cartService.getTotalCarts();
        return ResponseEntity.ok(
                ApiResponse.builder()
                        .data(count)
                        .message("Total carts retrieved successfully")
                        .build()
        );
    }

    @GetMapping("/admin/books/{bookId}/cart-count")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<?>> getBookCartCount(@PathVariable Long bookId) {
        Long count = cartService.getBookCartCount(bookId);
        return ResponseEntity.ok(
                ApiResponse.builder()
                        .data(count)
                        .message("Book cart count retrieved successfully")
                        .build()
        );
    }
} 