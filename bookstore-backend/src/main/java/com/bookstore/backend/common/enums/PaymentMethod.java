package com.bookstore.backend.common.enums;

public enum PaymentMethod {
    COD("Thanh toán khi nhận hàng"),
    VNPAY("Thanh toán qua VNPay"),
    MOMO("Thanh toán qua MoMo");

    private final String description;

    PaymentMethod(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }
}
