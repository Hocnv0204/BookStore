package com.bookstore.backend.service.impl;

import com.bookstore.backend.configuration.VNPayConfig;
import com.bookstore.backend.dto.PaymentDTO;
import com.bookstore.backend.dto.request.OrderRequest;
import com.bookstore.backend.dto.response.OrderPaymentResponse;
import com.bookstore.backend.service.PaymentService;
import com.bookstore.backend.service.OrderService;
import com.bookstore.backend.utils.VNPayUtil;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {
    private final VNPayConfig vnPayConfig;
    private final OrderService orderService;
    
    @Override
    public PaymentDTO.VNPayResponse createVnPayPayment(HttpServletRequest request) {
        long amount = Integer.parseInt(request.getParameter("amount")) * 100L;
        String bankCode = request.getParameter("bankCode");
        Map<String, String> vnpParamsMap = vnPayConfig.getVNPayConfig();
        vnpParamsMap.put("vnp_Amount", String.valueOf(amount));
        if (bankCode != null && !bankCode.isEmpty()) {
            vnpParamsMap.put("vnp_BankCode", bankCode);
        }
        vnpParamsMap.put("vnp_IpAddr", VNPayUtil.getIpAddress(request));
        //build query url
        String queryUrl = VNPayUtil.getPaymentURL(vnpParamsMap, true);
        String hashData = VNPayUtil.getPaymentURL(vnpParamsMap, false);
        String vnpSecureHash = VNPayUtil.hmacSHA512(vnPayConfig.getSecretKey(), hashData);
        queryUrl += "&vnp_SecureHash=" + vnpSecureHash;
        String paymentUrl = vnPayConfig.getVnp_PayUrl() + "?" + queryUrl;
        return PaymentDTO.VNPayResponse.builder()
                .code("ok")
                .message("success")
                .paymentUrl(paymentUrl).build();
    }
    
    @Override
    public OrderPaymentResponse createOrderWithPayment(OrderRequest request, HttpServletRequest servletRequest) {
        // Delegate to OrderService for order creation with payment
        return orderService.createOrderWithPayment(request, servletRequest);
    }
    
    @Override
    public void handleVnPayCallback(HttpServletRequest request) {
        String vnpResponseCode = request.getParameter("vnp_ResponseCode");
        String vnpTxnRef = request.getParameter("vnp_TxnRef"); // Order ID
        String vnpTransactionNo = request.getParameter("vnp_TransactionNo"); // VNPay transaction ID
        
        if (vnpTxnRef != null) {
            try {
                Long orderId = Long.parseLong(vnpTxnRef);
                
                if ("00".equals(vnpResponseCode)) {
                    // Payment successful
                    orderService.updatePaymentStatus(orderId, 
                        com.bookstore.backend.common.enums.PaymentStatus.PAID, 
                        vnpTransactionNo);
                } else {
                    // Payment failed
                    orderService.updatePaymentStatus(orderId, 
                        com.bookstore.backend.common.enums.PaymentStatus.FAILED, 
                        vnpTransactionNo);
                }
            } catch (NumberFormatException e) {
                // Log error - invalid order ID format
                System.err.println("Invalid order ID in VNPay callback: " + vnpTxnRef);
            }
        }
    }
    
    @Override
    public PaymentDTO.VNPayResponse checkPaymentStatus(String transactionId) {
        // TODO: Implement payment status checking
        // This will query VNPay API to check the status of a transaction
        return PaymentDTO.VNPayResponse.builder()
                .code("ok")
                .message("Payment status check not implemented yet")
                .build();
    }
}

