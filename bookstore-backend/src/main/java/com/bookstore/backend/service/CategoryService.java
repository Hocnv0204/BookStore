package com.bookstore.backend.service;

import com.bookstore.backend.dto.CategoryDto;
import com.bookstore.backend.dto.request.adminrequest.CategoryRequest;
import com.bookstore.backend.dto.response.PageResponse;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

public interface CategoryService {
    PageResponse<CategoryDto> getAllCategories(Pageable pageable);
    CategoryDto getCategoryById(Long id);
    CategoryDto createCategory(CategoryRequest request, MultipartFile image);
    CategoryDto updateCategory(Long id, CategoryRequest request, MultipartFile image);
    void deleteCategoryById(Long id);
    PageResponse<CategoryDto> searchCategories(String keyword, Pageable pageable);
}
