package com.bookstore.backend.mapper;

import com.bookstore.backend.dto.CouponDto;
import com.bookstore.backend.dto.CouponUsageDto;
import com.bookstore.backend.model.Coupon;
import com.bookstore.backend.model.CouponUsage;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.BeanMapping;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring")
public interface CouponMapper {
    
    @Mapping(target = "isValid", expression = "java(coupon.isValid())")
    @Mapping(target = "remainingUsage", expression = "java(coupon.getTotalUsageLimit() - coupon.getUsedCount())")
    @Mapping(target = "totalDiscountAmount", ignore = true) // Will be set separately
    CouponDto toDto(Coupon coupon);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "usedCount", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Coupon toEntity(CouponDto couponDto);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "code", ignore = true) // Code không được thay đổi sau khi tạo
    @Mapping(target = "usedCount", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    void updateCoupon(@MappingTarget Coupon coupon, CouponDto couponDto);

    // Mapping cho CouponUsage
    @Mapping(source = "coupon.id", target = "couponId")
    @Mapping(source = "coupon.code", target = "couponCode")
    @Mapping(source = "coupon.name", target = "couponName")
    @Mapping(source = "user.id", target = "userId")
    @Mapping(source = "user.username", target = "username")
    @Mapping(source = "order.id", target = "orderId")
    CouponUsageDto toDto(CouponUsage couponUsage);
}
