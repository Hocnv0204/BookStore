package com.bookstore.backend.controller;

import com.bookstore.backend.common.enums.OrderStatus;
import com.bookstore.backend.dto.OrderDto;
import com.bookstore.backend.dto.response.PageResponse;
import com.bookstore.backend.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import com.bookstore.backend.dto.request.OrderRequest;
@RestController
@RequiredArgsConstructor
public class OrderController {
    private final OrderService orderService;
    private static final int MAX_PAGE_SIZE = 20;

    // User endpoints
    @PostMapping("/users/orders/from-cart")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<OrderDto> createOrderFromCart(@RequestBody OrderRequest request) {
        return ResponseEntity.ok(orderService.createOrderFromCart(request));
    }

    @PutMapping("/users/orders/{orderId}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<OrderDto> updateOrder(
            @PathVariable Long orderId,
            @Valid @RequestBody OrderRequest request) {
        return ResponseEntity.ok(orderService.updateOrder(orderId, request));
    }

    @GetMapping("/users/orders")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<PageResponse<OrderDto>> getUserOrders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortOrder) {
        size = Math.min(size, MAX_PAGE_SIZE);
        Pageable pageable = PageRequest.of(page, size, 
                Sort.Direction.fromString(sortOrder), sortBy);
        return ResponseEntity.ok(orderService.getUserOrders(pageable));
    }

    @PostMapping("/users/orders/{orderId}/cancel")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<OrderDto> cancelOrder(@PathVariable Long orderId) {
        return ResponseEntity.ok(orderService.cancelOrder(orderId));
    }

    // Admin endpoints
    @GetMapping("/admin/orders")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PageResponse<OrderDto>> getAllOrders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortOrder) {
        size = Math.min(size, MAX_PAGE_SIZE);
        Pageable pageable = PageRequest.of(page, size, 
                Sort.Direction.fromString(sortOrder), sortBy);
        return ResponseEntity.ok(orderService.getAllOrders(pageable));
    }

    @GetMapping("/admin/users/{userId}/orders")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PageResponse<OrderDto>> getUserOrders(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortOrder) {
        size = Math.min(size, MAX_PAGE_SIZE);
        Pageable pageable = PageRequest.of(page, size, 
                Sort.Direction.fromString(sortOrder), sortBy);
        return ResponseEntity.ok(orderService.getUserOrders(userId, pageable));
    }

    @PutMapping("/admin/orders/{orderId}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<OrderDto> updateOrderStatus(
            @PathVariable Long orderId,
            @RequestParam OrderStatus status) {
        return ResponseEntity.ok(orderService.updateOrderStatus(orderId, status));
    }
} 