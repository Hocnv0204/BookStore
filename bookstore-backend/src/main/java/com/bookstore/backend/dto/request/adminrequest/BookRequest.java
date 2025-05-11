package com.bookstore.backend.dto.request.adminrequest;


import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder

public class CreateBookRequest {
    private String title ;
    private int quantityStock ;
    private double price ;
    private String description ;
    private String imageUrl ;
    private Long authorId ;
    private Long  categoryId ;
}
