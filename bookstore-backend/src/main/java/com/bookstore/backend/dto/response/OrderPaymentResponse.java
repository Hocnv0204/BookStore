package com.bookstore.backend.dto.response;

import com.bookstore.backend.dto.OrderDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderPaymentResponse {
    private OrderDto order;
    private String paymentUrl; // URL thanh toán (nếu là thanh toán online)
    private String message;
}
