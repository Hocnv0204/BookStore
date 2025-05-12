package com.bookstore.backend.dto;

import lombok.*;


@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CategoryDto {
    private String name ;
    private Long id ;
    private String imageUrl ; 
}
