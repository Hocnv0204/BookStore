package com.bookstore.backend.mapper;

import com.bookstore.backend.dto.AuthorDto;
import com.bookstore.backend.dto.BookDto;
import com.bookstore.backend.model.Author;
import com.bookstore.backend.model.Book;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.stream.Collectors;


@AllArgsConstructor
public class AuthorMapper {
    public static AuthorDto toDto(Author author){
        AuthorDto dto = AuthorDto.builder()
                .id(author.getId())
                .name(author.getName())
                .bio(author.getBio())
                .build() ;
        if(author.getBooks() != null){
            List<BookDto> bookDtos = author.getBooks().stream()
                    .map(book -> {
                        BookDto bookDto = BookMapper.toDto(book) ;
                        return bookDto ;
                    }).collect(Collectors.toList());
            dto.setBooks(bookDtos) ;
        }
        return dto ;
    }


    public static Author toEntity(AuthorDto dto){
        Author author = Author.builder()
                .id(dto.getId())
                .name(dto.getName())
                .bio(dto.getBio())
                .build() ;
        if(dto.getBooks() != null){
            List<Book> books = dto.getBooks().stream()
                    .map(bookDto -> {
                        Book book = BookMapper.toEntity(bookDto) ;
                        book.setAuthor(author);
                        return book ;
                    }).collect(Collectors.toList()) ;
            author.setBooks(books);
        }
        return author ;
    }
}
