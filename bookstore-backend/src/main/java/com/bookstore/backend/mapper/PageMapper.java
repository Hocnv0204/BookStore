package com.bookstore.backend.mapper;

import com.bookstore.backend.dto.response.PageResponse;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Component;

@Component
public class PageMapper {
    public <T> PageResponse<T> toPageResponse(Page<T> page){
        return PageResponse.<T>builder()
                .pageNumber(page.getNumber())
                .totalPages(page.getTotalPages())
                .pageSize(page.getSize())
                .totalElements(page.getTotalElements())
                .isLast(page.isLast())
                .content(page.getContent())
                .build() ;
    }
}
