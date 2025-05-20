package com.bookstore.backend.service.impl;

import com.bookstore.backend.dto.BookDto;
import com.bookstore.backend.dto.request.BookRequest;
import com.bookstore.backend.dto.response.PageResponse;
import com.bookstore.backend.exception.AppException;
import com.bookstore.backend.common.enums.ErrorCode;
import com.bookstore.backend.mapper.BookMapper;
import com.bookstore.backend.model.Book;
import com.bookstore.backend.repository.BookRepository;
import com.bookstore.backend.repository.CategoryRepository;
import com.bookstore.backend.service.BookService;
import com.bookstore.backend.service.FileStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class BookServiceImpl implements BookService {
    private final BookRepository bookRepository;
    private final CategoryRepository categoryRepository;
    private final BookMapper bookMapper;
    private final FileStorageService fileStorageService;

    @Override
    public PageResponse<BookDto> getAllBooks(Pageable pageable) {
        Page<Book> bookPage = bookRepository.findAll(pageable);
        return createPageResponse(bookPage);
    }

    @Override
    public BookDto getBookById(Long id) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.BOOK_NOT_FOUND));
        return bookMapper.toDto(book);
    }

    @Transactional
    @Override
    public BookDto createBook(BookRequest request , MultipartFile image) {

        var category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_FOUND));

        // Store image file
        System.out.println("BookRequest: " + request);
        System.out.println("Image: " + (image != null ? image.getOriginalFilename() : "null"));
        String imageFileName = fileStorageService.storeFile(image, "books");
        String imageUrl = fileStorageService.getFileUrl(imageFileName, "books");

        // Create book
        
        Book book = Book.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .publisher(request.getPublisher())
                .price(request.getPrice())
                .quantityStock(request.getQuantityStock())
                .authorName(request.getAuthorName())
                .category(category)
                .imageUrl(imageUrl)
                .build();

        return bookMapper.toDto(bookRepository.save(book));
    }

    @Override
    @Transactional
    public BookDto updateBook(Long id, BookRequest request, MultipartFile image) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.BOOK_NOT_FOUND));

        // Update basic info
        book.setTitle(request.getTitle());
        book.setDescription(request.getDescription());
        book.setPrice(request.getPrice());
        book.setQuantityStock(request.getQuantityStock());
        book.setAuthorName(request.getAuthorName());
        book.setPublisher(request.getPublisher());



        // Update category if changed
        if (!book.getCategory().getId().equals(request.getCategoryId())) {
            var category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_FOUND));
            book.setCategory(category);
        }

        // Update image if provided
        if (image != null && !image.isEmpty()) {
            // Delete old image
            String oldImageUrl = book.getImageUrl();
        if (oldImageUrl != null && !oldImageUrl.isEmpty()) {
            fileStorageService.deleteFile(oldImageUrl, "books");
        }

            // Store new image
            String newImageFileName = fileStorageService.storeFile(image, "books");
            String newImageUrl = fileStorageService.getFileUrl(newImageFileName, "books");
            book.setImageUrl(newImageUrl);
        }

        return bookMapper.toDto(bookRepository.save(book));
    }

    @Override
    @Transactional
    public void deleteBook(Long id) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.BOOK_NOT_FOUND));

        // ✅ Đảm bảo book.getImageUrl() trả về URL ảnh đầy đủ, không phải ID
        String imageUrl = book.getImageUrl() ;  // <-- Dòng này. Kiểm tra xem nó có null/empty không.
        System.out.println("DEBUG: imageUrl from book entity for deletion: " + imageUrl); // <-- THÊM DÒNG NÀY

        if (imageUrl != null && !imageUrl.isEmpty()) {
            System.out.println("Attempting to delete Cloudinary file with URL: " + imageUrl); // <-- THÊM DÒNG NÀY ĐỂ DEBUG
            fileStorageService.deleteFile(imageUrl, "books"); // <-- Truyền imageUrl ở đây
        } else {
            System.out.println("Book with ID " + id + " has no image URL to delete."); // <-- Log thông báo này
        }

        bookRepository.delete(book);
    }

    @Override
    public PageResponse<BookDto> searchBooks(String keyword, Pageable pageable) {
        Page<Book> bookPage = bookRepository.searchBooks(keyword, pageable);
        return createPageResponse(bookPage);
    }

    @Override
    public PageResponse<BookDto> getBooksByAuthor(String authorName, Pageable pageable) {
        Page<Book> bookPage = bookRepository.findByCategoryNameContainingIgnoreCase(authorName, pageable);
        return createPageResponse(bookPage);
    }

    @Override
    public PageResponse<BookDto> getBooksByPublisher(String publisher, Pageable pageable) {
        Page<Book> bookPage = bookRepository.findByPublisher( publisher, pageable);
        return createPageResponse(bookPage);
    }

    @Override
    public PageResponse<BookDto> getBooksByCategory(Long categoryId, Pageable pageable) {
        Page<Book> bookPage = bookRepository.findByCategoryId(categoryId, pageable);
        return createPageResponse(bookPage);
    }

    @Override
    public PageResponse<BookDto> getBooksByPriceRange(Double minPrice, Double maxPrice, Pageable pageable) {
        Page<Book> bookPage = bookRepository.findByPriceBetween(minPrice, maxPrice, pageable);
        return createPageResponse(bookPage);
    }

    private PageResponse<BookDto> createPageResponse(Page<Book> bookPage) {
        return PageResponse.<BookDto>builder()
                .content(bookPage.getContent().stream()
                        .map(bookMapper::toDto)
                        .collect(Collectors.toList()))
                .totalElements(bookPage.getTotalElements())
                .totalPages(bookPage.getTotalPages())
                .pageNumber(bookPage.getNumber())
                .pageSize(bookPage.getSize())
                .isLast(bookPage.isLast())
                .build();
    }

    @Override
    public BookDto getBookByName(String name) {
        Book book = bookRepository.findByTitle(name);
        if (book == null) {
            throw new AppException(ErrorCode.BOOK_NOT_FOUND);
        }
        return bookMapper.toDto(book);
    }
}
