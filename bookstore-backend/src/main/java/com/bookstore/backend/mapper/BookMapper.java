package com.bookstore.backend.mapper;

import com.bookstore.backend.dto.request.BookRequest;
import org.mapstruct.*;
import com.bookstore.backend.dto.BookDto;
import com.bookstore.backend.model.Book;
import org.springframework.stereotype.Component;

@Component
public class BookMapper {
    @Mapping(target = "categoryId", source = "category.id")
    public BookDto toDto(Book book) {
        return BookDto.builder()
                .id(book.getId())
                .title(book.getTitle())
                .description(book.getDescription())
                .quantityStock(book.getQuantityStock())
                .price(book.getPrice())
                .imageUrl(book.getImageUrl())
                .authorName(book.getAuthorName())
                .categoryId(book.getCategory().getId())
                .categoryName(book.getCategory().getName())
                .publisherId(book.getPublisher().getId())
                .publisherName(book.getPublisher().getName())
                .distributorId(book.getDistributor().getId())
                .distributorName(book.getDistributor().getName())
                .introduction(book.getIntroduction())
                .build();
    }

    @Mapping(target = "category.id", source = "categoryId")
    public Book toEntity(BookDto bookDto) {
        // Implementation of toEntity method
        return null; // Placeholder return, actual implementation needed
    }

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(source = "categoryId" , target = "category.id")
    @Mapping(target = "category.books" , ignore = true)
    void updateBook(@MappingTarget Book book, BookRequest request) {
        // Implementation of updateBook method
    }
}
