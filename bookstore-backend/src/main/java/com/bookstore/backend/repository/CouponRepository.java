package com.bookstore.backend.repository;

import com.bookstore.backend.common.enums.CouponStatus;
import com.bookstore.backend.model.Coupon;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface CouponRepository extends JpaRepository<Coupon, Long> {
    
    // Tìm coupon theo code
    Optional<Coupon> findByCode(String code);
    
    // Kiểm tra code đã tồn tại chưa
    boolean existsByCode(String code);
    
    // Tìm các coupon đang hoạt động
    @Query("SELECT c FROM Coupon c WHERE c.status = :status")
    Page<Coupon> findByStatus(@Param("status") CouponStatus status, Pageable pageable);
    
    // Tìm các coupon có thể sử dụng (đang hoạt động, trong thời hạn, còn lượt sử dụng)
    @Query("SELECT c FROM Coupon c WHERE c.status = 'ACTIVE' " +
           "AND c.startDate <= :now " +
           "AND c.endDate > :now " +
           "AND c.usedCount < c.totalUsageLimit")
    List<Coupon> findAvailableCoupons(@Param("now") LocalDateTime now);
    
    // Tìm coupon theo code và kiểm tra tính hợp lệ
    @Query("SELECT c FROM Coupon c WHERE c.code = :code " +
           "AND c.status = 'ACTIVE' " +
           "AND c.startDate <= :now " +
           "AND c.endDate > :now " +
           "AND c.usedCount < c.totalUsageLimit")
    Optional<Coupon> findValidCouponByCode(@Param("code") String code, @Param("now") LocalDateTime now);
    
    // Tìm theo tên hoặc code chứa keyword
    @Query("SELECT c FROM Coupon c WHERE " +
           "LOWER(c.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(c.code) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    Page<Coupon> findByKeyword(@Param("keyword") String keyword, Pageable pageable);
    
    // Đếm số coupon đang hoạt động
    long countByStatus(CouponStatus status);
    
    // Tìm các coupon sắp hết hạn
    @Query("SELECT c FROM Coupon c WHERE c.status = 'ACTIVE' " +
           "AND c.endDate BETWEEN :now AND :expiringSoon")
    List<Coupon> findExpiringSoon(@Param("now") LocalDateTime now, 
                                  @Param("expiringSoon") LocalDateTime expiringSoon);
}
