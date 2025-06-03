package com.bookstore.backend.dto;

import lombok.Builder;
import lombok.Data;

public abstract class PaymentDTO {
    @Data
    @Builder
    public static class VNPayResponse {
        private String code;
        private String message;
        private String paymentUrl;
    }
}
