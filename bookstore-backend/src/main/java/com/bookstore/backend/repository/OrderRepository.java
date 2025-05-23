package com.bookstore.backend.repository;

import com.bookstore.backend.common.enums.OrderStatus;
import com.bookstore.backend.model.Order;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    Optional<Order> findByIdAndUserId(Long id, Long userId);
    Page<Order> findByUserId(Long userId, Pageable pageable);

    @Query("SELECT o FROM Order o WHERE YEAR(o.createdAt) = :year AND o.status != :status")
    List<Order> findByCreatedAtYearAndStatusNot(@Param("year") Integer year, @Param("status") OrderStatus status);

    @Query("SELECT o FROM Order o WHERE YEAR(o.createdAt) = :year AND MONTH(o.createdAt) = :month AND o.status != :status")
    List<Order> findByCreatedAtYearAndMonthAndStatusNot(
            @Param("year") Integer year,
            @Param("month") Integer month,
            @Param("status") OrderStatus status);

    @Query("SELECT COUNT(oi) > 0 FROM OrderItem oi " +
           "JOIN oi.order o " +
           "WHERE o.user.id = :userId " +
           "AND oi.book.id = :bookId " +
           "AND o.status != 'CANCELLED'")
    boolean hasUserPurchasedBook(@Param("userId") Long userId, @Param("bookId") Long bookId);
}