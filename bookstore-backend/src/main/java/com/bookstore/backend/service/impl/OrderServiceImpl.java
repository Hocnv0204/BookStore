package com.bookstore.backend.service.impl;

import com.bookstore.backend.common.enums.OrderStatus;
import com.bookstore.backend.dto.CartDto;
import com.bookstore.backend.dto.OrderDto;
import com.bookstore.backend.dto.OrderItemDto;
import com.bookstore.backend.dto.request.OrderUpdateRequest;
import com.bookstore.backend.dto.response.PageResponse;
import com.bookstore.backend.exception.AppException;
import com.bookstore.backend.common.enums.ErrorCode;
import com.bookstore.backend.mapper.OrderItemMapper;
import com.bookstore.backend.mapper.OrderMapper;
import com.bookstore.backend.model.*;
import com.bookstore.backend.repository.BookRepository;
import com.bookstore.backend.repository.OrderItemRepository;
import com.bookstore.backend.repository.OrderRepository;
import com.bookstore.backend.repository.UserRepository;
import com.bookstore.backend.service.CartService;
import com.bookstore.backend.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.bookstore.backend.dto.request.OrderRequest;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final OrderMapper orderMapper;
    private final CartService cartService;
    private final BookRepository bookRepository;

    private String getCurrentUsername() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }
        return authentication.getName();
    }

    private User getCurrentUser() {
        return userRepository.findByUsername(getCurrentUsername())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
    }

    @Override
    @Transactional
    public OrderDto createOrderFromCart(OrderRequest request ) {
        User currentUser = getCurrentUser();
        CartDto cart = cartService.getCart();
        
        if (cart.getItems().isEmpty()) {
            throw new AppException(ErrorCode.CART_IS_EMPTY);
        }

        // Create new order
        Order order = Order.builder()
                .user(currentUser)
                .totalAmount(cart.getTotalPrice())
                .status(OrderStatus.PENDING)
                .build();

        // Convert cart items to order items
        List<OrderItem> orderItems = cart.getItems().stream()
                .map(cartItem -> OrderItem.builder()
                        .order(order)
                        .book(bookRepository.findById(cartItem.getBookId())
                                .orElseThrow(() -> new AppException(ErrorCode.BOOK_NOT_FOUND)))
                        .quantity(cartItem.getQuantity())
                        .price(cartItem.getPrice())
                        .build())
                .collect(Collectors.toList());

        order.setItems(orderItems);
        order.setTotalAmount(cart.getTotalPrice());
        order.setDeliveryAddress(request.getDeliveryAddress());
        order.setPhoneNumber(request.getPhoneNumber());
        order.setEmail(request.getEmail());
        order.setNote(request.getNote());
        order.setReceiverName(request.getReceiverName());
        orderRepository.save(order);

        // Clear the cart after successful order creation
        cartService.clearCart();

        return orderMapper.toDto(order);
    }

    @Override
    @Transactional
    public OrderDto updateOrder(Long orderId, OrderRequest request) {
        User currentUser = getCurrentUser();
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new AppException(ErrorCode.ORDER_NOT_FOUND));

        if (!order.getUser().getId().equals(currentUser.getId())) {
            throw new AppException(ErrorCode.FORBIDDEN);
        }

        if (order.getStatus() != OrderStatus.PENDING) {
            throw new AppException(ErrorCode.ORDER_CANNOT_BE_UPDATED);
        }
        order.setReceiverName(request.getReceiverName());
        order.setDeliveryAddress(request.getDeliveryAddress());
        order.setPhoneNumber(request.getPhoneNumber());
        order.setNote(request.getNote());
        order.setEmail(request.getEmail());
        
        return orderMapper.toDto(orderRepository.save(order));
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<OrderDto> getUserOrders(Pageable pageable) {
        User currentUser = getCurrentUser();
        Page<Order> orders = orderRepository.findByUserId(currentUser.getId(), pageable);
        
        List<OrderDto> orderDtos = orders.getContent().stream()
                .map(orderMapper::toDto)
                .collect(Collectors.toList());

        return PageResponse.<OrderDto>builder()
                .content(orderDtos)
                .totalElements(orders.getTotalElements())
                .totalPages(orders.getTotalPages())
                .pageNumber(orders.getNumber())
                .pageSize(orders.getSize())
                .isLast(orders.isLast())
                .build();
    }

    @Override
    @Transactional
    public OrderDto cancelOrder(Long orderId) {
        User currentUser = getCurrentUser();
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new AppException(ErrorCode.ORDER_NOT_FOUND));

        if (!order.getUser().getId().equals(currentUser.getId())) {
            throw new AppException(ErrorCode.FORBIDDEN);
        }

        if (order.getStatus() != OrderStatus.PENDING) {
            throw new AppException(ErrorCode.ORDER_CANNOT_BE_CANCELLED);
        }

        order.setStatus(OrderStatus.CANCELLED);
        return orderMapper.toDto(orderRepository.save(order));
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<OrderDto> getAllOrders(Pageable pageable) {
        Page<Order> orders = orderRepository.findAll(pageable);
        
        List<OrderDto> orderDtos = orders.getContent().stream()
                .map(orderMapper::toDto)
                .collect(Collectors.toList());

        return PageResponse.<OrderDto>builder()
                .content(orderDtos)
                .totalElements(orders.getTotalElements())
                .totalPages(orders.getTotalPages())
                .pageNumber(orders.getNumber())
                .pageSize(orders.getSize())
                .isLast(orders.isLast())
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<OrderDto> getUserOrders(Long userId, Pageable pageable) {
        if (!userRepository.existsById(userId)) {
            throw new AppException(ErrorCode.USER_NOT_FOUND);
        }

        Page<Order> orders = orderRepository.findByUserId(userId, pageable);
        
        List<OrderDto> orderDtos = orders.getContent().stream()
                .map(orderMapper::toDto)
                .collect(Collectors.toList());

        return PageResponse.<OrderDto>builder()
                .content(orderDtos)
                .totalElements(orders.getTotalElements())
                .totalPages(orders.getTotalPages())
                .pageNumber(orders.getNumber())
                .pageSize(orders.getSize())
                .isLast(orders.isLast())
                .build();
    }

    @Override
    @Transactional
    public OrderDto updateOrderStatus(Long orderId, OrderStatus status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new AppException(ErrorCode.ORDER_NOT_FOUND));

        if (order.getStatus() == OrderStatus.CANCELLED) {
            throw new AppException(ErrorCode.ORDER_CANNOT_BE_UPDATED);
        }

        if (order.getStatus() == OrderStatus.DELIVERED && status != OrderStatus.DELIVERED) {
            throw new AppException(ErrorCode.ORDER_CANNOT_BE_UPDATED);
        }

        order.setStatus(status);
        return orderMapper.toDto(orderRepository.save(order));
    }
} 