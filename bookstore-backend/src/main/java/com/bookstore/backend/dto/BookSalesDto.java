package com.bookstore.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
public class BookSalesDto {
    private Long bookId;
    private String bookTitle;
    private Integer soldQuantity;
    private Double totalRevenue;

    // Constructor for JPQL query
    public BookSalesDto(Long bookId, String bookTitle, Integer soldQuantity, Double totalRevenue ) {
        this.bookId = bookId;
        this.bookTitle = bookTitle;
        this.soldQuantity = soldQuantity;
        this.totalRevenue = totalRevenue;
    }
} 