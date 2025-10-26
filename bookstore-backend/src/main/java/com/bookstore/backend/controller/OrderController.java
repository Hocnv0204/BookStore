package com.bookstore.backend.controller;

import com.bookstore.backend.common.enums.OrderStatus;
import com.bookstore.backend.dto.OrderDto;
import com.bookstore.backend.dto.response.ApiResponse;
import com.bookstore.backend.dto.response.MonthlyRevenueDto;
import com.bookstore.backend.dto.response.DailyRevenueDto;
import com.bookstore.backend.dto.response.PageResponse;
import com.bookstore.backend.dto.response.OrderPaymentResponse;
import com.bookstore.backend.service.OrderService;
import com.bookstore.backend.utils.PageableUtils;
import jakarta.validation.Valid;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import com.bookstore.backend.dto.request.OrderRequest;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/orders")
public class OrderController {
    private final OrderService orderService;

    // User endpoints
    @PostMapping("/users/from-cart")

    public ResponseEntity<ApiResponse<?>> createOrderFromCart(@RequestBody OrderRequest request) {
        OrderDto order = orderService.createOrderFromCart(request);
        return ResponseEntity.ok(
                ApiResponse.builder()
                        .data(order)
                        .message("Order created from cart successfully")
                        .build()
        );
    }

    @PostMapping("/users/from-selected-items")

    public ResponseEntity<ApiResponse<?>> createOrderFromSelectedItems(
            @Valid @RequestBody OrderRequest request) {
        OrderDto order = orderService.createOrderFromSelectedCartItems(request, request.getCartItemIds());
        return ResponseEntity.ok(
                ApiResponse.builder()
                        .data(order)
                        .message("Order created from selected items successfully")
                        .build()
        );
    }

    @PostMapping("/users/with-payment")

    public ResponseEntity<ApiResponse<?>> createOrderWithPayment(
            @Valid @RequestBody OrderRequest request,
            HttpServletRequest servletRequest) {
        OrderPaymentResponse response = orderService.createOrderWithPayment(request, servletRequest);
        return ResponseEntity.ok(
                ApiResponse.builder()
                        .data(response)
                        .message("Order created with payment successfully")
                        .build()
        );
    }

    @GetMapping("/users/{orderId}")

    public ResponseEntity<ApiResponse<?>> getOrderById(@PathVariable Long orderId) {
        OrderDto order = orderService.getOrderById(orderId);
        return ResponseEntity.ok(
                ApiResponse.builder()
                        .data(order)
                        .message("Get order by id")
                        .build()
        );
    }

    @PutMapping("/users/{orderId}")
    public ResponseEntity<ApiResponse<?>> updateOrder(
            @PathVariable Long orderId,
            @Valid @RequestBody OrderRequest request) {
        OrderDto order = orderService.updateOrder(orderId, request);
        return ResponseEntity.ok(
                ApiResponse.builder()
                        .data(order)
                        .message("Order updated successfully")
                        .build()
        );
    }

    @GetMapping("/users")

    public ResponseEntity<ApiResponse<?>> getUserOrders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortOrder) {
        Pageable pageable = PageableUtils.setPageable(page, size, sortOrder, sortBy);
        PageResponse<OrderDto> response = orderService.getUserOrders(pageable);
        return ResponseEntity.ok(
                ApiResponse.builder()
                        .data(response)
                        .message("Get user orders")
                        .build()
        );
    }

    @PostMapping("/users/{orderId}/cancel")

    public ResponseEntity<ApiResponse<?>> cancelOrder(@PathVariable Long orderId) {
        OrderDto order = orderService.cancelOrder(orderId);
        return ResponseEntity.ok(
                ApiResponse.builder()
                        .data(order)
                        .message("Order cancelled successfully")
                        .build()
        );
    }

    // Admin endpoints
    @GetMapping("/admin")

    public ResponseEntity<ApiResponse<?>> getAllOrders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortOrder) {
        Pageable pageable = PageableUtils.setPageable(page, size, sortOrder, sortBy);
        PageResponse<OrderDto> response = orderService.getAllOrders(pageable);
        return ResponseEntity.ok(
                ApiResponse.builder()
                        .data(response)
                        .message("Get all orders")
                        .build()
        );
    }

    @GetMapping("/admin/users/{userId}")
    public ResponseEntity<ApiResponse<?>> getUserOrders(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortOrder) {
        Pageable pageable = PageableUtils.setPageable(page, size, sortOrder, sortBy);
        PageResponse<OrderDto> response = orderService.getUserOrders(userId, pageable);
        return ResponseEntity.ok(
                ApiResponse.builder()
                        .data(response)
                        .message("Get orders by user")
                        .build()
        );
    }

    @PutMapping("/admin/{orderId}/status")

    public ResponseEntity<ApiResponse<?>> updateOrderStatus(
            @PathVariable Long orderId,
            @RequestParam OrderStatus status) {
        OrderDto order = orderService.updateOrderStatus(orderId, status);
        return ResponseEntity.ok(
                ApiResponse.builder()
                        .data(order)
                        .message("Order status updated successfully")
                        .build()
        );
    }

    @GetMapping("/admin/revenue/monthly")

    public ResponseEntity<ApiResponse<?>> getMonthlyRevenue(
            @RequestParam(required = false) Integer year) {
        List<MonthlyRevenueDto> revenue = orderService.getMonthlyRevenue(year);
        return ResponseEntity.ok(
                ApiResponse.builder()
                        .data(revenue)
                        .message("Get monthly revenue")
                        .build()
        );
    }

    @GetMapping("/admin/revenue/daily")

    public ResponseEntity<ApiResponse<?>> getDailyRevenue(
            @RequestParam(required = false) Integer year,
            @RequestParam(required = false) Integer month) {
        List<DailyRevenueDto> revenue = orderService.getDailyRevenue(year, month);
        return ResponseEntity.ok(
                ApiResponse.builder()
                        .data(revenue)
                        .message("Get daily revenue")
                        .build()
        );
    }

    @GetMapping("/admin/search")

    public ResponseEntity<ApiResponse<?>> searchOrdersByCustomerName(
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortOrder) {
        Pageable pageable = PageableUtils.setPageable(page, size, sortOrder, sortBy);
        if (keyword == null) {
            keyword = "";
        }
        PageResponse<OrderDto> response = orderService.searchOrdersByCustomerName(keyword.trim(), pageable);
        return ResponseEntity.ok(
                ApiResponse.builder()
                        .data(response)
                        .message("Search orders by customer name")
                        .build()
        );
    }

    @GetMapping("/users/status")

    public ResponseEntity<ApiResponse<?>> getOrdersByStatus(
            @RequestParam String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortOrder) {
        Pageable pageable = PageableUtils.setPageable(page, size, sortOrder, sortBy);
        PageResponse<OrderDto> response = orderService.getOrdersByStatus(status, pageable);
        return ResponseEntity.ok(
                ApiResponse.builder()
                        .data(response)
                        .message("Get orders by status")
                        .build()
        );
    }
}