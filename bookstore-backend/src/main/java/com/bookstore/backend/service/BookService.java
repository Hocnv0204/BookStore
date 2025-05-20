package com.bookstore.backend.service;

import com.bookstore.backend.dto.BookDto;
import com.bookstore.backend.dto.request.BookRequest;
import com.bookstore.backend.dto.response.PageResponse;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

public interface BookService {
    PageResponse<BookDto> getAllBooks(Pageable pageable);
    BookDto getBookById(Long id);
    BookDto getBookByName(String name);
    BookDto createBook(BookRequest request, MultipartFile image);
    BookDto updateBook(Long id, BookRequest request, MultipartFile image);
    void deleteBook(Long id);
    PageResponse<BookDto> searchBooks(String keyword, Pageable pageable);
    PageResponse<BookDto> getBooksByCategory(Long categoryId, Pageable pageable);
    PageResponse<BookDto> getBooksByAuthor(String authorName, Pageable pageable);
    PageResponse<BookDto> getBooksByPriceRange(Double minPrice, Double maxPrice, Pageable pageable);
    PageResponse<BookDto> getBooksByPublisher(String publisher, Pageable pageable);

}
