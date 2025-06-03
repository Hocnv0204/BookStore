package com.bookstore.backend.repository;

import com.bookstore.backend.model.CouponUsage;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface CouponUsageRepository extends JpaRepository<CouponUsage, Long> {
    
    // Đếm số lần user đã sử dụng coupon cụ thể
    @Query("SELECT COUNT(cu) FROM CouponUsage cu WHERE cu.coupon.id = :couponId AND cu.user.id = :userId")
    Long countByCouponIdAndUserId(@Param("couponId") Long couponId, @Param("userId") Long userId);
    
    // Lấy lịch sử sử dụng coupon của user
    @Query("SELECT cu FROM CouponUsage cu WHERE cu.user.id = :userId ORDER BY cu.usedAt DESC")
    Page<CouponUsage> findByUserId(@Param("userId") Long userId, Pageable pageable);
    
    // Lấy lịch sử sử dụng của coupon cụ thể
    @Query("SELECT cu FROM CouponUsage cu WHERE cu.coupon.id = :couponId ORDER BY cu.usedAt DESC")
    Page<CouponUsage> findByCouponId(@Param("couponId") Long couponId, Pageable pageable);
    
    // Tính tổng số tiền đã giảm của coupon
    @Query("SELECT SUM(cu.discountAmount) FROM CouponUsage cu WHERE cu.coupon.id = :couponId")
    Double getTotalDiscountAmountByCouponId(@Param("couponId") Long couponId);
    
    // Lấy thống kê sử dụng coupon theo thời gian
    @Query("SELECT cu FROM CouponUsage cu WHERE cu.usedAt BETWEEN :startDate AND :endDate")
    List<CouponUsage> findByDateRange(@Param("startDate") LocalDateTime startDate, 
                                      @Param("endDate") LocalDateTime endDate);
    
    // Kiểm tra user đã sử dụng coupon trong order nào chưa
    boolean existsByCouponIdAndUserIdAndOrderId(Long couponId, Long userId, Long orderId);
    
    // Xóa coupon usage record theo orderId
    void deleteByOrderId(Long orderId);
}
