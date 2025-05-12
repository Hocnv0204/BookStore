package com.bookstore.backend.mapper;

import com.bookstore.backend.dto.AuthorDto;
import com.bookstore.backend.model.Author;
import org.mapstruct.Mapper;
@Mapper(componentModel = "spring")
public interface AuthorMapper {
    AuthorDto toDto(Author author);
}