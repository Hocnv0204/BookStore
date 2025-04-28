package com.bookstore.backend.service;

import com.bookstore.backend.dto.BookDto;
import com.bookstore.backend.dto.CategoryDto;

import java.util.List;

public interface CategoryService {
    CategoryDto updateCategory(CategoryDto dto , Long id) ;
    void deleteCategory(Long id) ;
    List<BookDto> getBooksByCategory(Long id) ;
    CategoryDto createCategory(CategoryDto dto) ;
    List<CategoryDto> getAllCategories() ;
}
