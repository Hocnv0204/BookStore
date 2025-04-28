package com.bookstore.backend.service;

import com.bookstore.backend.dto.AuthorDto;

import java.util.List;

public interface AuthorService {
    List<AuthorDto> getAllAuthors() ;
    AuthorDto getAuthorById(Long id) ;
    AuthorDto createAuthor(AuthorDto authorDto) ;
    AuthorDto updateAuthor(Long id , AuthorDto authorDto) ;
    void deleteAuthorById(Long id) ;
}
