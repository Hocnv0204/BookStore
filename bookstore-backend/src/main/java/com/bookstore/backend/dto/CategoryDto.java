package com.bookstore.backend.dto;

import lombok.*;


@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CategoryDto {
    private Long id ;
    private String name ;
    private String imageUrl ;
}
