package com.bookstore.backend.controller;

import com.bookstore.backend.dto.CategoryDto;
import com.bookstore.backend.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/categories")
public class CategoryController {
    private final CategoryService categoryService ;
    @GetMapping
    public List<CategoryDto> getAllCategories(){
        return categoryService.getAllCategories() ;
    }

    @PostMapping
    public CategoryDto createCategory(@RequestBody CategoryDto categoryDto){
        return categoryService.createCategory(categoryDto) ;
    }

}
