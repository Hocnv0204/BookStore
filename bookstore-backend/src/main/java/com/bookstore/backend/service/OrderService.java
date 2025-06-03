package com.bookstore.backend.service;

import com.bookstore.backend.dto.OrderDto;
import com.bookstore.backend.dto.request.OrderRequest;
import com.bookstore.backend.dto.response.PageResponse;
import com.bookstore.backend.dto.response.OrderPaymentResponse;
import com.bookstore.backend.common.enums.OrderStatus;
import com.bookstore.backend.common.enums.PaymentStatus;
import org.springframework.data.domain.Pageable;
import jakarta.servlet.http.HttpServletRequest;

import java.util.List;

public interface OrderService {
    // User methods
    OrderDto createOrderFromCart(OrderRequest request);
    OrderDto createOrderFromSelectedCartItems(OrderRequest request, List<Long> cartItemIds);
    
    // Tạo order với payment
    OrderPaymentResponse createOrderWithPayment(OrderRequest request, HttpServletRequest servletRequest);
    
    OrderDto updateOrder(Long orderId, OrderRequest request);
    PageResponse<OrderDto> getUserOrders(Pageable pageable);
    OrderDto cancelOrder(Long orderId);
    
    // Cập nhật trạng thái payment
    OrderDto updatePaymentStatus(Long orderId, PaymentStatus status, String transactionId);
    
    // Admin methods
    PageResponse<OrderDto> getAllOrders(Pageable pageable);
    PageResponse<OrderDto> getUserOrders(Long userId, Pageable pageable);
    OrderDto updateOrderStatus(Long orderId, OrderStatus status);
    OrderDto getOrderById(Long orderId);

    List<com.bookstore.backend.dto.response.MonthlyRevenueDto> getMonthlyRevenue(Integer year);
    
    List<com.bookstore.backend.dto.response.DailyRevenueDto> getDailyRevenue(Integer year, Integer month);

    PageResponse<OrderDto> searchOrdersByCustomerName(String keyword, Pageable pageable);
    PageResponse<OrderDto> getOrdersByStatus(String status , Pageable pageable) ;
}