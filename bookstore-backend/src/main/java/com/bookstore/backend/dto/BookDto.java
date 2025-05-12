package com.bookstore.backend.dto;

import lombok.* ;
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class BookDto {
    private Long id ;
    private String title ;
    private String description ;
    private Integer quantityStock ;
    private Double price ;
    private String imageUrl ;
    private Long authorId ;
    private Long categoryId ;
}
