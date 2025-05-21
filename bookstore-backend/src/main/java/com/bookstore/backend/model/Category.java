package com.bookstore.backend.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table (name = "categories")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id ;

    private String name ;

    @Column(name = "img_url")
    private String imageUrl ;


    @OneToMany(mappedBy = "category" , cascade = CascadeType.ALL)
    private List<Book> books ;
}
