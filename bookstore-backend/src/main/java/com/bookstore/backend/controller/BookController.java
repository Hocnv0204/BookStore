package com.bookstore.backend.controller;

import com.bookstore.backend.dto.BookDto;
import com.bookstore.backend.dto.request.BookRequest;
import com.bookstore.backend.dto.response.PageResponse;
import com.bookstore.backend.service.BookService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.fasterxml.jackson.databind.ObjectMapper;


@RestController
@RequestMapping
@RequiredArgsConstructor
public class BookController {
    private final BookService bookService;
    private static final int MAX_PAGE_SIZE = 20;

    private Pageable getPageable(Integer page, Integer size, String sortBy, String sortDirection) {
        int pageNumber = (page != null) ? page : 0;
        int pageSize = (size != null) ? Math.min(size, MAX_PAGE_SIZE) : 10;
        String sortField = (sortBy != null) ? sortBy : "id";
        Sort.Direction direction = (sortDirection != null) ? Sort.Direction.fromString(sortDirection) : Sort.Direction.ASC;
        return PageRequest.of(pageNumber, pageSize, Sort.by(direction, sortField));
    }

    @GetMapping("api/v1/books")
    public ResponseEntity<PageResponse<BookDto>> getAllBooks(
            @RequestParam(value = "page", required = false) Integer page,
            @RequestParam(value = "size", required = false) Integer size,
            @RequestParam(value = "sortBy", required = false) String sortBy,
            @RequestParam(value = "sortOrder", required = false) String sortDirection) {
        Pageable pageable = getPageable(page, size, sortBy, sortDirection);
        return ResponseEntity.ok(bookService.getAllBooks(pageable));
    }

    @GetMapping("api/v1/books/{id}")
    public ResponseEntity<BookDto> getBookById(@PathVariable Long id) {
        return ResponseEntity.ok(bookService.getBookById(id));
    }

    @GetMapping("api/v1/books/search")
    public ResponseEntity<PageResponse<BookDto>> searchBooks(
            @RequestParam String keyword,
            @RequestParam(value = "page", required = false) Integer page,
            @RequestParam(value = "size", required = false) Integer size,
            @RequestParam(value = "sortBy", required = false) String sortBy,
            @RequestParam(value = "sortOrder", required = false) String sortDirection) {
        Pageable pageable = getPageable(page, size, sortBy, sortDirection);
        return ResponseEntity.ok(bookService.searchBooks(keyword, pageable));
    }

    @GetMapping("api/v1/books/category/{categoryId}")
    public ResponseEntity<PageResponse<BookDto>> getBooksByCategory(
            @PathVariable Long categoryId,
            @RequestParam(value = "page", required = false) Integer page,
            @RequestParam(value = "size", required = false) Integer size,
            @RequestParam(value = "sortBy", required = false) String sortBy,
            @RequestParam(value = "sortDirection", required = false) String sortDirection) {
        Pageable pageable = getPageable(page, size, sortBy, sortDirection);
        return ResponseEntity.ok(bookService.getBooksByCategory(categoryId, pageable));
    }

    @GetMapping("api/v1/books/author/{authorId}")
    public ResponseEntity<PageResponse<BookDto>> getBooksByAuthor(
            @PathVariable Long authorId,
            @RequestParam(value = "page", required = false) Integer page,
            @RequestParam(value = "size", required = false) Integer size,
            @RequestParam(value = "sortBy", required = false) String sortBy,
            @RequestParam(value = "sortOrder", required = false) String sortDirection) {
        Pageable pageable = getPageable(page, size, sortBy, sortDirection);
        return ResponseEntity.ok(bookService.getBooksByAuthor(authorId, pageable));
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE, path = "admin/books")
    public ResponseEntity<BookDto> createBook(
            @RequestPart("book") String request,
            @RequestPart("image") MultipartFile image) {
            ObjectMapper objectMapper = new ObjectMapper() ;
            BookRequest bookRequest = null;
            try{
            bookRequest = objectMapper.readValue(request, BookRequest.class);
            }catch(Exception e){
                throw new RuntimeException("Invalid request body");
            }
        return ResponseEntity.ok(bookService.createBook(bookRequest, image));
    }

    @PutMapping(path = "admin/books/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE )
    public ResponseEntity<BookDto> updateBook(
            @PathVariable Long id,
            @RequestPart("book") String request,
            @RequestPart("image") MultipartFile image) {
            ObjectMapper objectMapper = new ObjectMapper() ;
            BookRequest bookRequest = null;
        try{
            bookRequest = objectMapper.readValue(request, BookRequest.class);
        }catch(Exception e){
            throw new RuntimeException("Invalid request body");
        }
        return ResponseEntity.ok(bookService.updateBook(id, bookRequest, image));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBook(@PathVariable Long id) {
        bookService.deleteBook(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/price-range")
    public ResponseEntity<PageResponse<BookDto>> getBooksByPriceRange(
            @RequestParam Double minPrice,
            @RequestParam Double maxPrice,
            @RequestParam(value = "page", required = false) Integer page,
            @RequestParam(value = "size", required = false) Integer size,
            @RequestParam(value = "sortBy", required = false) String sortBy,
            @RequestParam(value = "sortDirection", required = false) String sortDirection) {
        Pageable pageable = getPageable(page, size, sortBy, sortDirection);
        return ResponseEntity.ok(bookService.getBooksByPriceRange(minPrice, maxPrice, pageable));
    }
}
