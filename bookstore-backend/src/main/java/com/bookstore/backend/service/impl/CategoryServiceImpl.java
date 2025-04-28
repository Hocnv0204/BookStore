package com.bookstore.backend.service.impl;

import com.bookstore.backend.dto.BookDto;
import com.bookstore.backend.dto.CategoryDto;
import com.bookstore.backend.mapper.CategoryMapper;
import com.bookstore.backend.model.Category;
import com.bookstore.backend.repository.CategoryRepository;
import com.bookstore.backend.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {
    private final CategoryRepository categoryRepository ;
    @Override
    public CategoryDto createCategory(CategoryDto dto){
        Category category = CategoryMapper.toEntity(dto) ;
        return CategoryMapper.toDto(categoryRepository.save(category)) ;
    }
    @Override
    public CategoryDto updateCategory(CategoryDto dto , Long id){
        Category category = categoryRepository.findById(id)
                .orElseThrow(()-> new RuntimeException("Category not found!")) ;
        category.setName(dto.getName());
        category.setImageUrl(dto.getImageUrl());
        categoryRepository.save(category) ;
        return CategoryMapper.toDto(category) ;

    }
    @Override
    public List<CategoryDto>  getAllCategories(){
        return categoryRepository.findAll().stream()
                .map(CategoryMapper::toDto)
                .collect(Collectors.toList()) ;
    }
    @Override
    public List<BookDto> getBooksByCategory(Long id){
        Category category = categoryRepository.findById(id)
                .orElseThrow(()-> new RuntimeException("Category not found!")) ;
        return CategoryMapper.toDto(category).getBooks() ;
    }
    @Override
    public void deleteCategory(Long id){
        categoryRepository.deleteById(id);
    }

}
