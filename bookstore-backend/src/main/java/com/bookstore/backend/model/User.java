package com.bookstore.backend.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.Set;
@Entity
@Getter
@Setter
@AllArgsConstructor
@Builder
@RequiredArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY )
    private Long id ;
    private String username ;
    private String password ;
    private String fullName ;
    private String email ;
    private LocalDate dob ;
    private String gender ;
    private String role ;
}
