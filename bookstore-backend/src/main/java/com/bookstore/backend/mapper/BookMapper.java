package com.bookstore.backend.mapper;

import com.bookstore.backend.dto.BookDto;
import com.bookstore.backend.model.Book;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@AllArgsConstructor
public class BookMapper {
    public static  BookDto toDto(Book book ){
        return BookDto.builder()
                .id(book.getId())
                .price(book.getPrice())
                .title(book.getTitle())
                .description(book.getDescription())
                .quantityStock(book.getQuantityStock())
                .authorDto(AuthorMapper.toDto(book.getAuthor()))
                .categoryDto(CategoryMapper.toDto(book.getCategory()))
                .build() ;
    }

    public static Book toEntity(BookDto bookDto){
        return Book.builder()
                .id(bookDto.getId())
                .imageUrl(bookDto.getImageUrl())
                .title(bookDto.getTitle())
                .price(bookDto.getPrice())
                .description(bookDto.getDescription())
                .quantityStock(bookDto.getQuantityStock())
                .author(AuthorMapper.toEntity(bookDto.getAuthorDto()))
                .category(CategoryMapper.toEntity(bookDto.getCategoryDto()))
                .build() ;
    }
}
