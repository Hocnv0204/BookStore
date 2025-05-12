package com.bookstore.backend.mapper;

import com.bookstore.backend.dto.OrderItemDto;
import com.bookstore.backend.model.OrderItem;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface OrderItemMapper {
    @Mapping(source = "book.id", target = "bookId")
    @Mapping(source = "book.title", target = "bookTitle")
    @Mapping(source = "book.imageUrl", target = "bookImage")
    @Mapping(target = "subtotal", expression = "java(item.getPrice() * item.getQuantity())")
    OrderItemDto toDto(OrderItem item);
} 