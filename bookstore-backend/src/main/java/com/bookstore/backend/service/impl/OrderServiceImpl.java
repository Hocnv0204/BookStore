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
import com.bookstore.backend.service.BookService;
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
import java.util.Map;
import java.util.stream.Collectors;
import com.bookstore.backend.dto.response.MonthlyRevenueDto;
import java.time.Year;
import java.util.HashMap;
import java.time.LocalDateTime;
import java.time.YearMonth;
import com.bookstore.backend.dto.response.DailyRevenueDto;
import java.util.ArrayList;
import com.bookstore.backend.dto.CartItemDto;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final OrderMapper orderMapper;
    private final CartService cartService;
    private final BookRepository bookRepository;
    private final BookService bookService ; 
    
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
                                .orElseThrow(() -> new AppException(ErrorCode.BOOK_NOT_FOUND))
                                )
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
        // Update book stock
        bookService.updateBookStock(cart.getItems());
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
    @Override
    @Transactional(readOnly = true)
    public OrderDto getOrderById(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new AppException(ErrorCode.ORDER_NOT_FOUND));
        return orderMapper.toDto(order);
    }
    @Override
    @Transactional(readOnly = true)
    public List<MonthlyRevenueDto> getMonthlyRevenue(Integer year) {
        final int targetYear = year != null ? year : Year.now().getValue();
        
        // Validate year
        if (targetYear < 2000 || targetYear > Year.now().getValue()) {
            throw new AppException(ErrorCode.INVALID_YEAR);
        }
        
        // Get orders for the specified year that are not cancelled
        List<Order> orders = orderRepository.findByCreatedAtYearAndStatusNot(targetYear, OrderStatus.CANCELLED);
        
        // Initialize map with all months
        Map<Integer, Double> monthlyRevenue = new HashMap<>();
        for (int month = 1; month <= 12; month++) {
            monthlyRevenue.put(month, 0.0);
        }
        
        // Calculate revenue for each month
        orders.forEach(order -> {
            int month = order.getCreatedAt().getMonthValue();
            monthlyRevenue.put(month, monthlyRevenue.get(month) + order.getTotalAmount());
        });
        
        // Convert to DTO list
        return monthlyRevenue.entrySet().stream()
            .map(entry -> MonthlyRevenueDto.builder()
                .year(targetYear)
                .month(entry.getKey())
                .revenue(entry.getValue())
                .build())
            .sorted((a, b) -> a.getMonth().compareTo(b.getMonth()))
            .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<DailyRevenueDto> getDailyRevenue(Integer year, Integer month) {
        final int targetYear = year != null ? year : Year.now().getValue();
        final int targetMonth = month != null ? month : LocalDateTime.now().getMonthValue();
        
        // Validate year and month
        if (targetYear < 2000 || targetYear > Year.now().getValue()) {
            throw new AppException(ErrorCode.INVALID_YEAR);
        }
        if (targetMonth < 1 || targetMonth > 12) {
            throw new AppException(ErrorCode.INVALID_MONTH);
        }
        
        // Get orders for the specified year and month that are not cancelled
        List<Order> orders = orderRepository.findByCreatedAtYearAndMonthAndStatusNot(
            targetYear, targetMonth, OrderStatus.CANCELLED);
        
        // Get number of days in the month
        YearMonth yearMonth = YearMonth.of(targetYear, targetMonth);
        int daysInMonth = yearMonth.lengthOfMonth();
        
        // Initialize map with all days
        Map<Integer, Double> dailyRevenue = new HashMap<>();
        for (int day = 1; day <= daysInMonth; day++) {
            dailyRevenue.put(day, 0.0);
        }
        
        // Calculate revenue for each day
        orders.forEach(order -> {
            int day = order.getCreatedAt().getDayOfMonth();
            dailyRevenue.put(day, dailyRevenue.get(day) + order.getTotalAmount());
        });
        
        // Convert to DTO list
        return dailyRevenue.entrySet().stream()
            .map(entry -> DailyRevenueDto.builder()
                .year(targetYear)
                .month(targetMonth)
                .day(entry.getKey())
                .revenue(entry.getValue())
                .build())
            .sorted((a, b) -> a.getDay().compareTo(b.getDay()))
            .collect(Collectors.toList());
    }

    @Override
    public PageResponse<OrderDto> searchOrdersByCustomerName(String keyword, Pageable pageable) {
        Page<Order> orders = orderRepository.findByReceiverNameContainingIgnoreCase(keyword, pageable);
        return createPageResponse(orders);
    }

    private PageResponse<OrderDto> createPageResponse(Page<Order> orderPage) {
        return PageResponse.<OrderDto>builder()
                .content(orderPage.getContent().stream()
                        .map(this::mapToDto)
                        .collect(Collectors.toList()))
                .totalElements(orderPage.getTotalElements())
                .totalPages(orderPage.getTotalPages())
                .pageNumber(orderPage.getNumber())
                .pageSize(orderPage.getSize())
                .isLast(orderPage.isLast())
                .build();
    }

    private OrderDto mapToDto(Order order) {
        return OrderDto.builder()
                .id(order.getId())
                .userId(order.getUser().getId())
                .username(order.getUser().getUsername())
                .receiverName(order.getReceiverName())
                .deliveryAddress(order.getDeliveryAddress())
                .phoneNumber(order.getPhoneNumber())
                .email(order.getEmail())
                .totalAmount(order.getTotalAmount())
                .status(order.getStatus())
                .note(order.getNote())
                .createdAt(order.getCreatedAt())
                .updatedAt(order.getUpdatedAt())
                .items(order.getItems().stream()
                        .map(this::mapOrderItemToDto)
                        .collect(Collectors.toList()))
                .build();
    }

    private OrderItemDto mapOrderItemToDto(OrderItem orderItem) {
        return OrderItemDto.builder()
                .id(orderItem.getId())
                .bookId(orderItem.getBook().getId())
                .bookTitle(orderItem.getBook().getTitle())
                .bookImage(orderItem.getBook().getImageUrl())
                .quantity(orderItem.getQuantity())
                .price(orderItem.getPrice())
                .subtotal(orderItem.getPrice() * orderItem.getQuantity())
                .build();
    }

    @Override
    @Transactional
    public OrderDto createOrderFromSelectedCartItems(OrderRequest request, List<Long> cartItemIds) {
        User user = getCurrentUser();
        CartDto cartDto = cartService.getCart();

        // Get selected cart items
        List<CartItemDto> selectedItems = cartService.getSelectedCartItems(cartItemIds);
        if (selectedItems.isEmpty()) {
            throw new AppException(ErrorCode.INVALID_REQUEST);
        }

        // Create order
        Order order = Order.builder()
                .user(user)
                .status(OrderStatus.PENDING)
                .receiverName(request.getReceiverName())
                .deliveryAddress(request.getDeliveryAddress())
                .phoneNumber(request.getPhoneNumber())
                .email(request.getEmail())
                .note(request.getNote())
                .items(new ArrayList<>())
                .build();

        // Create order items and calculate total
        double totalAmount = 0;
        for (CartItemDto cartItem : selectedItems) {
            Book book = bookRepository.findById(cartItem.getBookId())
                    .orElseThrow(() -> new AppException(ErrorCode.BOOK_NOT_FOUND));
            
            // Check stock
            if (book.getQuantityStock() < cartItem.getQuantity()) {
                throw new AppException(ErrorCode.OUT_OF_STOCK);
            }

            OrderItem orderItem = OrderItem.builder()
                    .order(order)
                    .book(book)
                    .quantity(cartItem.getQuantity())
                    .price(cartItem.getPrice())
                    .build();

            order.getItems().add(orderItem);
            totalAmount += cartItem.getPrice() * cartItem.getQuantity();

            // Update book stock
            book.setQuantityStock(book.getQuantityStock() - cartItem.getQuantity());
            bookRepository.save(book);
        }

        order.setTotalAmount(totalAmount);
        order = orderRepository.save(order);

        // Remove selected items from cart
        cartService.removeSelectedItems(cartItemIds);

        return orderMapper.toDto(order);
    }
}