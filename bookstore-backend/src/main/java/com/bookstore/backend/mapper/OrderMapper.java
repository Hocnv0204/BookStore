package com.bookstore.backend.mapper;

import com.bookstore.backend.dto.OrderDto;
import com.bookstore.backend.model.Order;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = OrderItemMapper.class)
public interface OrderMapper {
    @Mapping(source = "user.id", target = "userId")
    @Mapping(source = "user.username", target = "username")
    @Mapping(source = "items", target = "items")
    OrderDto toDto(Order order);
} 