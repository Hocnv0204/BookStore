package com.bookstore.backend.service.impl;

import com.bookstore.backend.dto.BookDto;
import com.bookstore.backend.dto.request.BookRequest;
import com.bookstore.backend.dto.response.PageResponse;
import com.bookstore.backend.exception.AppException;
import com.bookstore.backend.common.enums.ErrorCode;
import com.bookstore.backend.mapper.BookMapper;
import com.bookstore.backend.model.Book;
import com.bookstore.backend.model.CartItem;
import com.bookstore.backend.model.Publisher;
import com.bookstore.backend.model.Distributor;
import com.bookstore.backend.repository.BookRepository;
import com.bookstore.backend.repository.CategoryRepository;
import com.bookstore.backend.repository.PublisherRepository;
import com.bookstore.backend.repository.DistributorRepository;
import com.bookstore.backend.service.BookService;
import com.bookstore.backend.service.FileStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import com.bookstore.backend.dto.CartItemDto;
import java.util.List;
import java.util.stream.Collectors;
import com.bookstore.backend.dto.BookSalesDto;

@Service
@RequiredArgsConstructor
@Transactional
public class BookServiceImpl implements BookService {
    private final BookRepository bookRepository;
    private final CategoryRepository categoryRepository;
    private final PublisherRepository publisherRepository;
    private final DistributorRepository distributorRepository;
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
    public BookDto createBook(BookRequest request, MultipartFile image) {
        // Validate and get category
        var category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_FOUND));

        // Validate and get publisher
        var publisher = publisherRepository.findById(request.getPublisherId())
                .orElseThrow(() -> new AppException(ErrorCode.PUBLISHER_NOT_FOUND));

        // Validate and get distributor
        var distributor = distributorRepository.findById(request.getDistributorId())
                .orElseThrow(() -> new AppException(ErrorCode.DISTRIBUTOR_NOT_FOUND));

        // Store image file
        String imageFileName = fileStorageService.storeFile(image, "books");
        String imageUrl = fileStorageService.getFileUrl(imageFileName, "books");

        // Create book
        Book book = Book.builder()
                .introduction(request.getIntroduction())
                .title(request.getTitle())
                .description(request.getDescription())
                .price(request.getPrice())
                .quantityStock(request.getQuantityStock())
                .authorName(request.getAuthorName())
                .category(category)
                .publisher(publisher)
                .distributor(distributor)
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
        book.setIntroduction(request.getIntroduction());

        // Update category if changed
        if (!book.getCategory().getId().equals(request.getCategoryId())) {
            var category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_FOUND));
            book.setCategory(category);
        }

        // Update publisher if changed
        if (!book.getPublisher().getId().equals(request.getPublisherId())) {
            var publisher = publisherRepository.findById(request.getPublisherId())
                    .orElseThrow(() -> new AppException(ErrorCode.PUBLISHER_NOT_FOUND));
            book.setPublisher(publisher);
        }

        // Update distributor if changed
        if (!book.getDistributor().getId().equals(request.getDistributorId())) {
            var distributor = distributorRepository.findById(request.getDistributorId())
                    .orElseThrow(() -> new AppException(ErrorCode.DISTRIBUTOR_NOT_FOUND));
            book.setDistributor(distributor);
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
    public PageResponse<BookDto> searchBooks(String keyword, Long categoryId,Long publisherId,Long distributorId, Double minPrice, Double maxPrice, Pageable pageable) {
        Page<Book> bookPage = bookRepository.searchBooks(keyword, categoryId, minPrice, maxPrice, pageable);
        return createPageResponse(bookPage);
    }

    @Override
    public PageResponse<BookDto> getBooksByAuthor(String authorName, Pageable pageable) {
        Page<Book> bookPage = bookRepository.findByCategoryNameContainingIgnoreCase(authorName, pageable);
        return createPageResponse(bookPage);
    }

    @Override
    public PageResponse<BookDto> getBooksByPublisher(Long publisherId, Pageable pageable) {
        Page<Book> bookPage = bookRepository.findByPublisherId(publisherId, pageable);
        return createPageResponse(bookPage);
    }

    @Override
    public PageResponse<BookDto> getBooksByDistributor(Long distributorId, Pageable pageable) {
        Page<Book> bookPage = bookRepository.findByDistributorId(distributorId, pageable);
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
    @Override 
    public void updateBookStock(List<CartItemDto> cartItems) {

        for (CartItemDto cartItem : cartItems) {
            Book book = bookRepository.findById(cartItem.getBookId())
                    .orElseThrow(() -> new AppException(ErrorCode.BOOK_NOT_FOUND));
            int newQuantityStock = book.getQuantityStock() - cartItem.getQuantity();
            if (newQuantityStock < 0) {
                throw new AppException(ErrorCode.OUT_OF_STOCK);
            }
            book.setQuantityStock(newQuantityStock);
            bookRepository.save(book);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public Integer getBookSoldQuantity(Long bookId) {
        // Verify book exists
        if (!bookRepository.existsById(bookId)) {
            throw new AppException(ErrorCode.BOOK_NOT_FOUND);
        }
        
        Integer soldQuantity = bookRepository.getTotalSoldQuantity(bookId);
        return soldQuantity != null ? soldQuantity : 0;
    }

    @Override
    @Transactional(readOnly = true)
    public List<BookSalesDto> getAllBooksSales() {
        return bookRepository.getAllBooksSales();
    }
}
