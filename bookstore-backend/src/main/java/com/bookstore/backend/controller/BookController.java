package com.bookstore.backend.controller;

import com.bookstore.backend.dto.BookDto;
import com.bookstore.backend.service.BookService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/books")
@RequiredArgsConstructor
public class BookController {

    private final BookService bookService ;

    @GetMapping
    public List<BookDto> getAllBooks(){
        return bookService.getAllBooks() ;
    }

    @GetMapping("/{id}")
    public BookDto getBookById(@PathVariable Long id){
        return bookService.getBookById(id) ;
    }

    @PostMapping
    public BookDto createBook(@RequestBody BookDto bookDto){
        return bookService.createBook(bookDto) ;
    }

    @PutMapping("/{id}")
    public BookDto updateBook(@PathVariable Long id , @RequestBody BookDto bookDto){
        return bookService.updateBook(id , bookDto) ;
    }

    @DeleteMapping("/{id}")
    public String deleteBookById(@PathVariable Long id){
        bookService.deleteBookById(id) ;
        return "book deleted successfully" ;
    }

}
