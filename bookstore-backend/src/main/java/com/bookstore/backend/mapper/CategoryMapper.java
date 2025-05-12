package com.bookstore.backend.mapper;

import com.bookstore.backend.dto.request.adminrequest.CategoryRequest;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.Builder;
import com.bookstore.backend.dto.CategoryDto;
import com.bookstore.backend.model.Category;

@Mapper(componentModel = "spring", builder = @Builder(disableBuilder = false))
public interface CategoryMapper {

    CategoryDto toDto(Category category);

    Category toEntity(CategoryRequest request);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "books", ignore = true)
    void updateCategory(@MappingTarget Category category, CategoryRequest request );
}
