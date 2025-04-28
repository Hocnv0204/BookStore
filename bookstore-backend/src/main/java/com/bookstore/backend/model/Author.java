package com.bookstore.backend.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;
@Table(name = "authors")
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Author {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id ;

    @Column(name = "name")
    private String name ;

    @Column(name = "bio"  , length = 1000 )
    private String bio ;

    @OneToMany(mappedBy = "author" , cascade = CascadeType.ALL)
    private List<Book> books ;
}
