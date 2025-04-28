package com.bookstore.backend.service.impl;

import com.bookstore.backend.dto.AuthorDto;
import com.bookstore.backend.dto.BookDto;
import com.bookstore.backend.mapper.AuthorMapper;
import com.bookstore.backend.mapper.BookMapper;
import com.bookstore.backend.mapper.CategoryMapper;
import com.bookstore.backend.model.Author;
import com.bookstore.backend.model.Book;
import com.bookstore.backend.repository.AuthorRepository;
import com.bookstore.backend.repository.BookRepository;
import com.bookstore.backend.repository.CategoryRepository;
import com.bookstore.backend.service.BookService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookServiceImpl implements BookService {
    private final BookRepository bookRepository;
    @Override
    public BookDto createBook(BookDto dto){
        Book book = BookMapper.toEntity(dto) ;
        return BookMapper.toDto(bookRepository.save(book)) ;
    }
    @Override
    public BookDto getBookById(Long id){
        Book book = bookRepository.findById(id)
                .orElseThrow(()-> new RuntimeException("Book not found")) ;
        return BookMapper.toDto(book) ;
    }

    @Override
    public BookDto updateBook(Long id , BookDto bookDto){
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Book not found")) ;
        book.setAuthor(AuthorMapper.toEntity(bookDto.getAuthorDto()));
        book.setCategory(CategoryMapper.toEntity(bookDto.getCategoryDto()));
        book.setDescription(bookDto.getDescription());
        book.setPrice(bookDto.getPrice());
        book.setQuantityStock(bookDto.getQuantityStock());
        book.setImageUrl(bookDto.getImageUrl());
        book.setTitle(bookDto.getTitle());
        return BookMapper.toDto(bookRepository.save(book)) ;
    }

    @Override
    public List<BookDto> getAllBooks(){
        return bookRepository.findAll().stream()
                .map(book -> {
                    BookDto bookDto = BookMapper.toDto(book) ;
                    return bookDto ;
                }).collect(Collectors.toList()) ;
    }

    @Override
    public void deleteBookById(Long id){
        bookRepository.deleteById(id);
    }
}
