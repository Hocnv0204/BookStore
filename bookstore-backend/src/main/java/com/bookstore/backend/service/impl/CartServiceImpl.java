package com.bookstore.backend.service.impl;

import com.bookstore.backend.dto.CartDto;
import com.bookstore.backend.dto.CartItemDto;
import com.bookstore.backend.dto.request.CartItemRequest;
import com.bookstore.backend.dto.response.PageResponse;
import com.bookstore.backend.exception.AppException;
import com.bookstore.backend.common.enums.ErrorCode;
import com.bookstore.backend.mapper.CartItemMapper;
import com.bookstore.backend.mapper.CartMapper;
import com.bookstore.backend.model.Book;
import com.bookstore.backend.model.Cart;
import com.bookstore.backend.model.CartItem;
import com.bookstore.backend.model.User;
import com.bookstore.backend.repository.BookRepository;
import com.bookstore.backend.repository.CartItemRepository;
import com.bookstore.backend.repository.CartRepository;
import com.bookstore.backend.repository.UserRepository;
import com.bookstore.backend.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CartServiceImpl implements CartService {
    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final BookRepository bookRepository;
    private final UserRepository userRepository;
    private final CartMapper cartMapper;
    private final CartItemMapper cartItemMapper;

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

    private Cart getOrCreateCart() {
        User user = getCurrentUser();
        return cartRepository.findByUserId(user.getId())
                .orElseGet(() -> {
                    Cart cart = Cart.builder()
                            .user(user)
                            .items(new ArrayList<>())
                            .build();
                    return cartRepository.save(cart);
                });
    }

    @Override
    public PageResponse<CartDto> getCart(Pageable pageable) {
        Cart cart = getOrCreateCart();
        Page<CartItem> cartItems = cartItemRepository.findByCartId(cart.getId(), pageable);
        List<CartItemDto> cartItemDtos = cartItems.getContent().stream()
                .map(cartItemMapper::toDto)
                .collect(Collectors.toList());
        
        CartDto cartDto = cartMapper.toDto(cart);
        cartDto.setItems(cartItemDtos);
        
        return PageResponse.<CartDto>builder()
                .content(List.of(cartDto))
                .totalElements(cartItems.getTotalElements())
                .totalPages(cartItems.getTotalPages())
                .pageNumber(cartItems.getNumber())
                .pageSize(cartItems.getSize())
                .isLast(cartItems.isLast())
                .build();
    }

    @Override
    @Transactional
    public CartDto addItem(CartItemRequest request) {
        Cart cart = getOrCreateCart();
        Book book = bookRepository.findById(request.getBookId())
                .orElseThrow(() -> new AppException(ErrorCode.BOOK_NOT_FOUND));

        if (book.getQuantityStock() <= 0) {
            throw new AppException(ErrorCode.OUT_OF_STOCK);
        }

        CartItem existingItem = cartItemRepository.findByCartIdAndBookId(cart.getId(), book.getId())
                .orElse(null);

        if (existingItem != null) {
            existingItem.setQuantity(existingItem.getQuantity() + request.getQuantity());
            cartItemRepository.save(existingItem);
        } else {
            CartItem newItem = CartItem.builder()
                    .cart(cart)
                    .book(book)
                    .quantity(Math.min(request.getQuantity(), book.getQuantityStock()))
                    .price(book.getPrice())
                    .build();
            cartItemRepository.save(newItem);
            cart.getItems().add(newItem);
        }

        return cartMapper.toDto(cart);
    }

    @Override
    @Transactional
    public CartDto updateItemQuantity(Long bookId, Integer quantity) {
        Cart cart = getOrCreateCart();
        CartItem item = cartItemRepository.findByCartIdAndBookId(cart.getId(), bookId)
                .orElseThrow(() -> new AppException(ErrorCode.RESOURCE_NOT_FOUND));

        if (quantity <= 0) {
            cartItemRepository.delete(item);
        } else {
            Book book = bookRepository.findById(bookId)
                    .orElseThrow(() -> new AppException(ErrorCode.BOOK_NOT_FOUND));

            if (book.getQuantityStock() <= 0) {
                throw new AppException(ErrorCode.OUT_OF_STOCK);
            }

            item.setQuantity(Math.min(quantity, book.getQuantityStock()));
            cartItemRepository.save(item);
        }

        return cartMapper.toDto(cart);
    }

    @Override
    @Transactional
    public CartDto removeItem(Long bookId) {
        Cart cart = getOrCreateCart();
        cartItemRepository.deleteByCartIdAndBookId(cart.getId(), bookId);
        cart.getItems().removeIf(item -> item.getBook().getId().equals(bookId));
        cartRepository.save(cart);
        return cartMapper.toDto(cart);
    }

    @Override
    public PageResponse<CartDto> getAllCarts(Pageable pageable) {
        Page<Cart> carts = cartRepository.findAll(pageable);
        List<CartDto> cartDtos = carts.getContent().stream()
                .map(cartMapper::toDto)
                .collect(Collectors.toList());
        
        return PageResponse.<CartDto>builder()
                .content(cartDtos)
                .totalElements(carts.getTotalElements())
                .totalPages(carts.getTotalPages())
                .pageNumber(carts.getNumber())
                .pageSize(carts.getSize())
                .isLast(carts.isLast())
                .build();
    }

    @Override
    public Long getTotalCarts() {
        return cartRepository.countTotalCarts();
    }

    @Override
    public Long getBookCartCount(Long bookId) {
        return cartRepository.countBookInCarts(bookId);
    }

    @Override
    @Transactional(readOnly = true)
    public CartDto getCart() {
        Cart cart = getOrCreateCart();
        return cartMapper.toDto(cart);
    }

    @Override
    @Transactional
    public void clearCart() {
        Cart cart = getOrCreateCart();
        cartItemRepository.deleteByCartId(cart.getId());
        cart.getItems().clear();
        cartRepository.save(cart);
    }
} 