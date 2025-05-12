package com.bookstore.backend.mapper;

import com.bookstore.backend.dto.ReviewDto;
import com.bookstore.backend.dto.request.ReviewRequest;
import com.bookstore.backend.model.Review;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface ReviewMapper {
    @Mapping(source = "user.id", target = "userId")
    @Mapping(source = "user.username", target = "username")
    @Mapping(source = "book.id", target = "bookId")
    @Mapping(source = "book.title", target = "bookTitle")
    ReviewDto toDto(Review review);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateReview(@MappingTarget Review review, ReviewRequest request);
} 