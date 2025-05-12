// package com.bookstore.backend.controller;

// import com.bookstore.backend.dto.PaymentDTO;
// import com.bookstore.backend.service.PaymentService;
// import jakarta.servlet.http.HttpServletRequest;
// import lombok.RequiredArgsConstructor;
// import org.springframework.http.ResponseEntity;
// import org.springframework.web.bind.annotation.*;

// @RestController
// @RequestMapping("/api/v1/payment")
// @RequiredArgsConstructor
// public class PaymentController {
//     private final PaymentService paymentService;

//     @PostMapping("/vnpay")
//     public ResponseEntity<PaymentDTO.VNPayResponse> createVNPayPayment(HttpServletRequest request) {
//         try {
//             PaymentDTO.VNPayResponse response = paymentService.createVNPayPayment(request);
//             return ResponseEntity.ok(response);
//         } catch (Exception e) {
//             return ResponseEntity.badRequest().body(
//                 PaymentDTO.VNPayResponse.builder()
//                     .code("error")
//                     .message(e.getMessage())
//                     .paymentUrl(null)
//                     .build()
//             );
//         }
//     }

//     // You can implement the callback handler here if needed
// }