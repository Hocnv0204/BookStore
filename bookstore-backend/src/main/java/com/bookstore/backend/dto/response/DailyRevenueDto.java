package com.bookstore.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DailyRevenueDto {
    private Integer year;
    private Integer month;
    private Integer day;
    private Double revenue;
} 