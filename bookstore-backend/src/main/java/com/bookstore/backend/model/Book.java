package com.bookstore.backend.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "books")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Book {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id ;

    @Column(name = "title" , nullable = false)
    private String title ;

    @Column (name = "quantity_stock")
    private Integer quantityStock ;

    @Column (name = "price")
    private Double price ;

    @ManyToOne
    @JoinColumn(name = "author_id")
    private Author author ;

    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category ;

    @Column(name = "description" , length = 1000)
    private String description ;

    @Column(name = "image_url")
    private String imageUrl ;

}
