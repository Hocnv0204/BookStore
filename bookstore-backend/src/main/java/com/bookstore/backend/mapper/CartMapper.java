package com.bookstore.backend.mapper;


import com.bookstore.backend.dto.CartDto;
import com.bookstore.backend.dto.CartItemDto;
import com.bookstore.backend.model.Cart;
import com.bookstore.backend.model.CartItem;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface CartMapper {
    @Mapping(source = "user.id", target = "userId")
    @Mapping(source = "user.username", target = "username")
    @Mapping(source = "items", target = "items")
    @Mapping(target = "totalPrice", expression = "java(calculateTotalPrice(cart))")
    CartDto toDto(Cart cart);

    @Mapping(source = "book.id", target = "bookId")
    @Mapping(source = "book.title", target = "bookTitle")
    @Mapping(source = "book.imageUrl", target = "bookImage")
    @Mapping(target = "subtotal", expression = "java(item.getPrice() * item.getQuantity())")
    CartItemDto toDto(CartItem item);

    default Double calculateTotalPrice(Cart cart) {
        return cart.getItems().stream()
                .mapToDouble(item -> item.getPrice() * item.getQuantity())
                .sum();
    }
} 