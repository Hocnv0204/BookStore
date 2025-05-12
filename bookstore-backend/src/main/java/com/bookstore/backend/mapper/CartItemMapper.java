package com.bookstore.backend.mapper;

import com.bookstore.backend.dto.CartItemDto;
import com.bookstore.backend.model.CartItem;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface CartItemMapper {
    @Mapping(source = "book.id", target = "bookId")
    @Mapping(source = "book.title", target = "bookTitle")
    @Mapping(source = "book.imageUrl", target = "bookImage")
    @Mapping(target = "subtotal", expression = "java(item.getPrice() * item.getQuantity())")
    CartItemDto toDto(CartItem item);
} 