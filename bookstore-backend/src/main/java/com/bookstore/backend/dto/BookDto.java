package com.bookstore.backend.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookDto {
    private Long id;
    private String title;
    private String description;
    private Integer quantityStock;
    private Double price;
    private String imageUrl;
    private String authorName;
    private Long categoryId;
    private String categoryName;
    private Long publisherId;
    private String publisherName;
    private Long distributorId;
    private String distributorName;
    private String introduction;
}
