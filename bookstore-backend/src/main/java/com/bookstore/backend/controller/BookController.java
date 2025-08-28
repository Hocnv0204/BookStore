package com.bookstore.backend.controller;

import com.bookstore.backend.dto.BookDto;
import com.bookstore.backend.dto.request.BookRequest;
import com.bookstore.backend.dto.response.ApiResponse;
import com.bookstore.backend.dto.response.PageResponse;
import com.bookstore.backend.service.BookService;
import com.bookstore.backend.utils.PageableUtils;
import com.cloudinary.Api;
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
@RequestMapping("/api/books")
@RequiredArgsConstructor
public class BookController {
    private final BookService bookService;
    private static final int MAX_PAGE_SIZE = 20;

    

    @GetMapping
    public ResponseEntity<ApiResponse<?>> getAllBooks(
            @RequestParam(value = "page", required = false) Integer page,
            @RequestParam(value = "size", required = false) Integer size,
            @RequestParam(value = "sortBy", required = false) String sortBy,
            @RequestParam(value = "sortOrder", required = false) String sortOrder) {
        Pageable pageable = PageableUtils.setPageable(page , size , sortOrder , sortBy ) ;
        PageResponse<BookDto> response = bookService.getAllBooks(pageable) ;
        return ResponseEntity.ok().body(
                ApiResponse.builder()
                        .data(response)
                        .message("Get all books")
                        .build()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<?>> getBookById(@PathVariable Long id) {
        return ResponseEntity.ok(
                ApiResponse.builder()
                        .data(bookService.getBookById(id))
                        .message("Get book by id")
                        .build()
        ) ;
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<?>> searchBooks(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) Long publisherId,
            @RequestParam(required = false) Long distributorId,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice,
            @RequestParam(value = "page", required = false) Integer page,
            @RequestParam(value = "size", required = false) Integer size,
            @RequestParam(value = "sortBy", required = false) String sortBy,
            @RequestParam(value = "sortOrder", required = false) String orderBy) {
        Pageable pageable = PageableUtils.setPageable(page, size, orderBy, sortBy);
        if (keyword == null) {
            keyword = "";
        }
        PageResponse<BookDto> response = bookService.searchBooks(keyword.trim(), categoryId, publisherId, distributorId, minPrice, maxPrice, pageable) ;
        return ResponseEntity.ok(
                ApiResponse.builder()
                        .data(response)
                        .message("Get book by keyword")
                        .build()
        );
    }

    @GetMapping("/category/{categoryId}")
    public ResponseEntity<ApiResponse<?>> getBooksByCategory(
            @PathVariable Long categoryId,
            @RequestParam(value = "page", required = false) Integer page,
            @RequestParam(value = "size", required = false) Integer size,
            @RequestParam(value = "sortBy", required = false) String sortBy,
            @RequestParam(value = "sortOrder", required = false) String sortOrder) {
        Pageable pageable = PageableUtils.setPageable(page , size , sortOrder , sortBy) ;
        PageResponse<BookDto> response = bookService.getBooksByCategory(categoryId , pageable) ;
        return ResponseEntity.ok(
                ApiResponse.builder()
                        .data(response)
                        .message("Get book by category")
                        .build()
        );
    }

    @GetMapping("/publisher/{publisherId}")
    public ResponseEntity<ApiResponse<?>> getBooksByPublisher(
            @PathVariable Long publisherId,
            @RequestParam(value = "page", required = false) Integer page,
            @RequestParam(value = "size", required = false) Integer size,
            @RequestParam(value = "sortBy", required = false) String sortBy,
            @RequestParam(value = "sortOrder", required = false) String sortOrder) {
        Pageable pageable = PageableUtils.setPageable(page, size, sortOrder, sortBy);
        PageResponse<BookDto> response = bookService.getBooksByPublisher(publisherId, pageable);
        return ResponseEntity.ok(
                ApiResponse.builder()
                        .data(response)
                        .message("Get books by publisher")
                        .build()
        );
    }

    @GetMapping("/distributor/{distributorId}")
    public ResponseEntity<ApiResponse<?>> getBooksByDistributor(
            @PathVariable Long distributorId,
            @RequestParam(value = "page", required = false) Integer page,
            @RequestParam(value = "size", required = false) Integer size,
            @RequestParam(value = "sortBy", required = false) String sortBy,
            @RequestParam(value = "sortOrder", required = false) String sortOrder) {
        Pageable pageable = PageableUtils.setPageable(page, size, sortOrder, sortBy);
        PageResponse<BookDto> response = bookService.getBooksByDistributor(distributorId, pageable);
        return ResponseEntity.ok(
                ApiResponse.builder()
                        .data(response)
                        .message("Get books by distributor")
                        .build()
        );
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE, path = "admin/books")
    public ResponseEntity<ApiResponse<?>> createBook(
            @RequestPart("book") String request,
            @RequestPart("image") MultipartFile image) {
            ObjectMapper objectMapper = new ObjectMapper() ;
            BookRequest bookRequest = null;
            try{
            bookRequest = objectMapper.readValue(request, BookRequest.class);
            }catch(Exception e){
                throw new RuntimeException("Invalid request body");
            }
        BookDto createdBook = bookService.createBook(bookRequest, image);
        return ResponseEntity.ok(
                ApiResponse.builder()
                        .data(createdBook)
                        .message("Book created successfully")
                        .build()
        );
    }

    @PutMapping(path = "/admin/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE )
    public ResponseEntity<ApiResponse<?>> updateBook(
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
        BookDto updatedBook = bookService.updateBook(id, bookRequest, image);
        return ResponseEntity.ok(
                ApiResponse.builder()
                        .data(updatedBook)
                        .message("Book updated successfully")
                        .build()
        );
    }

    @DeleteMapping("/admin/delete/{id}")
    public ResponseEntity<ApiResponse<?>> deleteBook(@PathVariable Long id) {
        bookService.deleteBook(id);
        return ResponseEntity.ok(
                ApiResponse.builder()
                        .data(null)
                        .message("Book deleted successfully")
                        .build()
        );
    }

    @GetMapping("/price-range")
    public ResponseEntity<ApiResponse<?>> getBooksByPriceRange(
            @RequestParam Double minPrice,
            @RequestParam Double maxPrice,
            @RequestParam(value = "page", required = false) Integer page,
            @RequestParam(value = "size", required = false) Integer size,
            @RequestParam(value = "sortBy", required = false) String sortBy,
            @RequestParam(value = "sortOrder", required = false) String sortOrder) {
        Pageable pageable = PageableUtils.setPageable(page, size, sortOrder, sortBy);
        PageResponse<BookDto> response = bookService.getBooksByPriceRange(minPrice, maxPrice, pageable);
        return ResponseEntity.ok(
                ApiResponse.builder()
                        .data(response)
                        .message("Get books by price range")
                        .build()
        );
    }

    @GetMapping("/sales/{id}")
    public ResponseEntity<ApiResponse<?>> getBookSales(@PathVariable Long id) {
        Integer sales = bookService.getBookSoldQuantity(id);
        return ResponseEntity.ok(
                ApiResponse.builder()
                        .data(sales)
                        .message("Get book sales quantity")
                        .build()
        );
    }

    @GetMapping("/sales")
    public ResponseEntity<ApiResponse<?>> getAllBooksSales() {
        List<BookSalesDto> sales = bookService.getAllBooksSales();
        return ResponseEntity.ok(
                ApiResponse.builder()
                        .data(sales)
                        .message("Get all books sales")
                        .build()
        );
    }
}
