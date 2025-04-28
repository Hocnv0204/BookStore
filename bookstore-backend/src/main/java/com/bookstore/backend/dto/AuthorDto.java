package com.bookstore.backend.dto;

import lombok.*;

import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthorDto {
    private Long id ;
    private String name ;
    private String bio ;
    private List<BookDto> books ;
}
