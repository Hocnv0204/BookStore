package com.bookstore.backend.model;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import java.util.List;

@Getter
@Setter
@Entity
@Table(name = "distributors")
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Distributor {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @Column(nullable = false, unique = true)
    String name;

    String address;

    String phoneNumber;

    @Column(unique = true)
    String email;

    @OneToMany(mappedBy = "distributor", cascade = CascadeType.ALL)
    List<Book> books;
}
