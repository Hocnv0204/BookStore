package com.bookstore.backend.mapper;

import com.bookstore.backend.dto.BookDto;
import com.bookstore.backend.dto.CategoryDto;
import com.bookstore.backend.model.Book;
import com.bookstore.backend.model.Category;
import lombok.*;

import java.util.List;
import java.util.stream.Collectors;

@Builder
@Setter
@Getter
@AllArgsConstructor
public class CategoryMapper {
    public static  CategoryDto toDto (Category category){
        CategoryDto dto =  CategoryDto.builder()
                .id(category.getId())
                .name(category.getName())
                .imageUrl(category.getImageUrl())
                .build() ;
        if (category.getBooks() != null){
            List<BookDto> bookDtos = category.getBooks().stream()
                    .map(book -> {
                        BookDto bookDto = BookMapper.toDto(book) ;
                        return bookDto ;
                    }).collect(Collectors.toList()) ;
            dto.setBooks(bookDtos) ;
        }
        return dto ;
    }
    public static  Category toEntity (CategoryDto dto){
        Category category = Category.builder()
                .id(dto.getId())
                .imageUrl(dto.getImageUrl())
                .name(dto.getName())
                .build() ;
        if (dto.getBooks() != null){
            List<Book> books = dto.getBooks().stream()
                    .map(bookDto -> {
                        Book book = BookMapper.toEntity(bookDto);
                        book.setCategory(category);
                        return book ;
                    }).collect(Collectors.toList()) ;
            category.setBooks(books) ;
        }
        return category ;

    }
}
