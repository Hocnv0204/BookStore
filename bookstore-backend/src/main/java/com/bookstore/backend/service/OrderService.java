package com.bookstore.backend.service;

import com.bookstore.backend.dto.OrderDto;
import com.bookstore.backend.dto.request.OrderRequest;
import com.bookstore.backend.dto.response.PageResponse;
import com.bookstore.backend.common.enums.OrderStatus;
import org.springframework.data.domain.Pageable;

public interface OrderService {
    // User methods
    OrderDto createOrderFromCart(OrderRequest request);
    OrderDto updateOrder(Long orderId, OrderRequest request);
    PageResponse<OrderDto> getUserOrders(Pageable pageable);
    OrderDto cancelOrder(Long orderId);
    
    // Admin methods
    PageResponse<OrderDto> getAllOrders(Pageable pageable);
    PageResponse<OrderDto> getUserOrders(Long userId, Pageable pageable);
    OrderDto updateOrderStatus(Long orderId, OrderStatus status);
    OrderDto getOrderById(Long orderId);
} 