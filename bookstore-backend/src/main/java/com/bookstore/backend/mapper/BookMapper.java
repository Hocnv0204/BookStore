package com.bookstore.backend.mapper;

import com.bookstore.backend.dto.request.BookRequest;
import org.mapstruct.*;
import com.bookstore.backend.dto.BookDto;
import com.bookstore.backend.model.Book;

@Mapper(componentModel = "spring", builder = @Builder(disableBuilder = false))
public interface BookMapper {
    Book toEntity(BookRequest request);

    @Mapping(source = "author.id" , target = "authorId")
    @Mapping(source = "category.id" , target = "categoryId")
    BookDto toDto(Book book);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(source = "authorId" , target = "author.id")
    @Mapping(source = "categoryId" , target = "category.id")
    @Mapping(target = "category.books" , ignore = true)
    void updateBook(@MappingTarget Book book, BookRequest request);
}
