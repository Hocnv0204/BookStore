package com.bookstore.backend.repository;

import com.bookstore.backend.model.Book;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import com.bookstore.backend.dto.BookSalesDto;

@Repository
public interface BookRepository extends JpaRepository<Book, Long> {
    Page<Book> findByTitleContainingIgnoreCase(String title, Pageable pageable);
    Book findByTitle(String title);
    
    @Query("SELECT b FROM Book b WHERE " +
           "(:keyword IS NULL OR :keyword = '' OR " +
           "LOWER(b.title) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    Page<Book> searchBooks(@Param("keyword") String keyword, Pageable pageable);
    
    @Query("SELECT b FROM Book b WHERE LOWER(b.authorName) LIKE LOWER(CONCAT('%', :authorName, '%'))")
    Page<Book> findByAuthorNameContainingIgnoreCase(@Param("authorName") String authorName, Pageable pageable);
    
    @Query("SELECT b FROM Book b WHERE LOWER(b.publisher) LIKE LOWER(CONCAT('%', :publisher, '%'))")
    Page<Book> findByPublisher(@Param("publisher")String publisher , Pageable pageable);
    
    @Query("SELECT b FROM Book b WHERE LOWER(b.category.name) LIKE LOWER(CONCAT('%', :categoryName, '%'))")
    Page<Book> findByCategoryNameContainingIgnoreCase(@Param("categoryName") String categoryName, Pageable pageable);
    
    Page<Book> findByPriceBetween(Double minPrice, Double maxPrice, Pageable pageable);
    Page<Book> findByCategoryId(Long categoryId, Pageable pageable);
    
    @Query("SELECT SUM(oi.quantity) FROM OrderItem oi " +
           "JOIN oi.order o " +
           "WHERE oi.book.id = :bookId " +
           "AND o.status != 'CANCELLED'")
    Integer getTotalSoldQuantity(@Param("bookId") Long bookId);

    @Query("SELECT new com.bookstore.backend.dto.BookSalesDto(" +
           "b.id, b.title, " +
           "CAST(COALESCE(SUM(oi.quantity), 0) AS integer), " +
           "CAST(COALESCE(SUM(oi.quantity * oi.price), 0.0) AS double)) " +
           "FROM Book b " +
           "LEFT JOIN OrderItem oi ON oi.book.id = b.id " +
           "LEFT JOIN Order o ON o.id = oi.order.id AND o.status != 'CANCELLED' " +
           "GROUP BY b.id, b.title")
    List<BookSalesDto> getAllBooksSales();
}
