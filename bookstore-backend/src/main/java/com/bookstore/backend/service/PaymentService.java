package com.bookstore.backend.service;

import com.bookstore.backend.dto.PaymentDTO;
import com.bookstore.backend.dto.request.OrderRequest;
import com.bookstore.backend.dto.response.OrderPaymentResponse;
import jakarta.servlet.http.HttpServletRequest;

public interface PaymentService {
    PaymentDTO.VNPayResponse createVnPayPayment(HttpServletRequest request);
    
    // Tạo order với payment
    OrderPaymentResponse createOrderWithPayment(OrderRequest request, HttpServletRequest servletRequest);
    
    // Xử lý callback từ VNPay
    void handleVnPayCallback(HttpServletRequest request);
    
    // Kiểm tra trạng thái thanh toán
    PaymentDTO.VNPayResponse checkPaymentStatus(String transactionId);
}
