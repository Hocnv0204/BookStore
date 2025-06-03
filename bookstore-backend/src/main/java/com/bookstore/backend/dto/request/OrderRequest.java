package com.bookstore.backend.dto.request;

import com.bookstore.backend.common.enums.PaymentMethod;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import java.util.List;

@Getter
@Setter
@Builder
@AllArgsConstructor
public class OrderRequest {
    private List<Long> cartItemIds;
    private String receiverName;
    private String deliveryAddress;
    private String phoneNumber;
    private String email;
    private String note;
    private PaymentMethod paymentMethod; // Phương thức thanh toán
}
