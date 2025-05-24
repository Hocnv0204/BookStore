package com.bookstore.backend.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DistributorDto {
    private Long id;
    private String name;
    private String address;
    private String phoneNumber;
    private String email;
  
} 