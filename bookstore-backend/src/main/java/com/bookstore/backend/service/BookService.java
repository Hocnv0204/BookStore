package com.bookstore.backend.service;

import com.bookstore.backend.dto.BookDto;
import java.util.List ;
public interface BookService {
    List<BookDto> getAllBooks() ;
    BookDto getBookById(Long id) ;
    BookDto createBook(BookDto bookDto) ;
    BookDto updateBook(Long id , BookDto bookDto) ;
    void deleteBookById(Long id) ;
}
