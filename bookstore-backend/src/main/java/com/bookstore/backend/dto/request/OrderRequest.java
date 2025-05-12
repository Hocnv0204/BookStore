package com.bookstore.backend.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
@AllArgsConstructor
public class OrderRequest {
    private String receiverName ;
    private String deliveryAddress ;
    private String phoneNumber ;
    private String email ;
    private String note ;
}
