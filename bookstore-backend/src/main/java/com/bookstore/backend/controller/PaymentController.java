package com.bookstore.backend.controller;

import com.bookstore.backend.dto.PaymentDTO;
import com.bookstore.backend.dto.request.OrderRequest;
import com.bookstore.backend.dto.response.OrderPaymentResponse;
import com.bookstore.backend.service.PaymentService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping
@RequiredArgsConstructor
public class PaymentController {
    private final PaymentService paymentService;
    
    @GetMapping("api/v1/payment/vn-pay")
    public ResponseEntity<PaymentDTO.VNPayResponse> pay(HttpServletRequest request) {
        try {
            return ResponseEntity.ok(paymentService.createVnPayPayment(request));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("api/v1/payment/vn-pay-callback")
    public ResponseEntity<PaymentDTO.VNPayResponse> payCallbackHandler(HttpServletRequest request) {
        String status = request.getParameter("vnp_ResponseCode");
        if (status == null) {
            return ResponseEntity.badRequest().build();
        }
        
        // Handle callback
        paymentService.handleVnPayCallback(request);
        
        if (status.equals("00")) {
            PaymentDTO.VNPayResponse response = PaymentDTO.VNPayResponse.builder()
                    .code("00")
                    .message("Success")
                    .paymentUrl("")
                    .build();
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().build();
        }
    }
    
    // Endpoint để tạo order với payment
    @PostMapping("api/v1/payment/create-order")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<OrderPaymentResponse> createOrderWithPayment(
            @Valid @RequestBody OrderRequest request,
            HttpServletRequest servletRequest) {
        return ResponseEntity.ok(paymentService.createOrderWithPayment(request, servletRequest));
    }
    
    // Endpoint để check payment status
    @GetMapping("api/v1/payment/status/{transactionId}")
    public ResponseEntity<PaymentDTO.VNPayResponse> checkPaymentStatus(@PathVariable String transactionId) {
        return ResponseEntity.ok(paymentService.checkPaymentStatus(transactionId));
    }
    
    // Endpoint để redirect sau khi thanh toán thành công
    @GetMapping("api/v1/payment/success")
    public ResponseEntity<String> paymentSuccess(
            @RequestParam(required = false) String orderId,
            @RequestParam(required = false) String transactionId) {
        String message = String.format("Thanh toán thành công! Mã đơn hàng: %s, Mã giao dịch: %s", 
                                       orderId, transactionId);
        return ResponseEntity.ok(message);
    }
    
    // Endpoint để redirect khi thanh toán thất bại
    @GetMapping("api/v1/payment/failed")
    public ResponseEntity<String> paymentFailed(
            @RequestParam(required = false) String orderId,
            @RequestParam(required = false) String reason) {
        String message = String.format("Thanh toán thất bại! Mã đơn hàng: %s, Lý do: %s", 
                                       orderId, reason != null ? reason : "Không xác định");
        return ResponseEntity.ok(message);
    }
}
