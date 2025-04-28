package com.bookstore.backend.dto;

import lombok.*;

import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CategoryDto {
    private String name ;
    private Long id ;
    private String imageUrl ;
    private List<BookDto> books ;
}
