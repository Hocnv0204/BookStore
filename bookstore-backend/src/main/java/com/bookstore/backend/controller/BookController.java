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
import com.bookstore.backend.dto.BookSalesDto;
import java.util.List;

@RestController
@RequestMapping
@RequiredArgsConstructor
public class BookController {
    private final BookService bookService;
    private static final int MAX_PAGE_SIZE = 20;

    private Pageable getPageable(Integer page, Integer size, String sortBy, String sortOrder) {
        int pageNumber = (page != null) ? page : 0;
        int pageSize = (size != null) ? Math.min(size, MAX_PAGE_SIZE) : 10;
        String sortField = (sortBy != null) ? sortBy : "id";
        Sort.Direction direction = (sortOrder != null) ? Sort.Direction.fromString(sortOrder) : Sort.Direction.ASC;
        return PageRequest.of(pageNumber, pageSize, Sort.by(direction, sortField));
    }

    @GetMapping("api/v1/books")
    public ResponseEntity<PageResponse<BookDto>> getAllBooks(
            @RequestParam(value = "page", required = false) Integer page,
            @RequestParam(value = "size", required = false) Integer size,
            @RequestParam(value = "sortBy", required = false) String sortBy,
            @RequestParam(value = "sortOrder", required = false) String sortOrder) {
        Pageable pageable = getPageable(page, size, sortBy, sortOrder);
        return ResponseEntity.ok(bookService.getAllBooks(pageable));
    }

    @GetMapping("api/v1/books/{id}")
    public ResponseEntity<BookDto> getBookById(@PathVariable Long id) {
        return ResponseEntity.ok(bookService.getBookById(id));
    }

    @GetMapping("api/v1/books/search")
    public ResponseEntity<PageResponse<BookDto>> searchBooks(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) Long publisherId,
            @RequestParam(required = false) Long distributorId,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice,
            @RequestParam(value = "page", required = false) Integer page,
            @RequestParam(value = "size", required = false) Integer size,
            @RequestParam(value = "sortBy", required = false) String sortBy,
            @RequestParam(value = "sortOrder", required = false) String sortDirection) {
        Pageable pageable = getPageable(page, size, sortBy, sortDirection);
        if (keyword == null) {
            keyword = "";
        }
        return ResponseEntity.ok(bookService.searchBooks(keyword.trim(), categoryId, publisherId, distributorId, minPrice, maxPrice, pageable));
    }

    @GetMapping("api/v1/books/category/{categoryId}")
    public ResponseEntity<PageResponse<BookDto>> getBooksByCategory(
            @PathVariable Long categoryId,
            @RequestParam(value = "page", required = false) Integer page,
            @RequestParam(value = "size", required = false) Integer size,
            @RequestParam(value = "sortBy", required = false) String sortBy,
            @RequestParam(value = "sortOrder", required = false) String sortOrder) {
        Pageable pageable = getPageable(page, size, sortBy, sortOrder);
        return ResponseEntity.ok(bookService.getBooksByCategory(categoryId, pageable));
    }

    @GetMapping("api/v1/books/publisher/{publisherId}")
    public ResponseEntity<PageResponse<BookDto>> getBooksByPublisher(
            @PathVariable Long publisherId,
            @RequestParam(value = "page", required = false) Integer page,
            @RequestParam(value = "size", required = false) Integer size,
            @RequestParam(value = "sortBy", required = false) String sortBy,
            @RequestParam(value = "sortOrder", required = false) String sortOrder) {
        Pageable pageable = getPageable(page, size, sortBy, sortOrder);
        return ResponseEntity.ok(bookService.getBooksByPublisher(publisherId, pageable));
    }

    @GetMapping("api/v1/books/distributor/{distributorId}")
    public ResponseEntity<PageResponse<BookDto>> getBooksByDistributor(
            @PathVariable Long distributorId,
            @RequestParam(value = "page", required = false) Integer page,
            @RequestParam(value = "size", required = false) Integer size,
            @RequestParam(value = "sortBy", required = false) String sortBy,
            @RequestParam(value = "sortOrder", required = false) String sortOrder) {
        Pageable pageable = getPageable(page, size, sortBy, sortOrder);
        return ResponseEntity.ok(bookService.getBooksByDistributor(distributorId, pageable));
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
            @RequestPart(value = "image" , required = false ) MultipartFile image ) {
            ObjectMapper objectMapper = new ObjectMapper() ;
            BookRequest bookRequest = null;
                System.out.println("Received book JSON string: " + request); // <--- THÊM DÒNG NÀY

        try{
            bookRequest = objectMapper.readValue(request, BookRequest.class);
        }catch(Exception e){
            e.printStackTrace();
            throw new RuntimeException("Invalid request body");
        }
        return ResponseEntity.ok(bookService.updateBook(id, bookRequest, image));
    }

    @DeleteMapping("admin/books/delete/{id}")
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
            @RequestParam(value = "sortOrder", required = false) String sortOrder) {
        Pageable pageable = getPageable(page, size, sortBy, sortOrder);
        return ResponseEntity.ok(bookService.getBooksByPriceRange(minPrice, maxPrice, pageable));
    }

    @GetMapping("/api/v1/books/{id}/sales")
    public ResponseEntity<Integer> getBookSales(@PathVariable Long id) {
        return ResponseEntity.ok(bookService.getBookSoldQuantity(id));
    }

    @GetMapping("/api/v1/books/sales")
    public ResponseEntity<List<BookSalesDto>> getAllBooksSales() {
        return ResponseEntity.ok(bookService.getAllBooksSales());
    }
}
