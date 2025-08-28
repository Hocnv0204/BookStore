package com.bookstore.backend.controller;

import com.bookstore.backend.dto.CategoryDto;
import com.bookstore.backend.service.CategoryService;
import com.bookstore.backend.utils.PageableUtils;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.mail.Multipart;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.MediaType;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import com.bookstore.backend.dto.request.adminrequest.CategoryRequest;
import com.bookstore.backend.dto.response.PageResponse; 
import com.bookstore.backend.dto.response.ApiResponse;
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/categories")
public class CategoryController {
    private final CategoryService categoryService ;
    @GetMapping
    public ResponseEntity<ApiResponse<?>> getAllCategories(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size,
        @RequestParam(defaultValue = "id") String sortBy,
        @RequestParam(defaultValue = "asc") String sortDirection
    ){
        Pageable pageable = com.bookstore.backend.utils.PageableUtils.setPageable(page, size, sortDirection, sortBy);
        PageResponse<CategoryDto> response = categoryService.getAllCategories(pageable);
        return ResponseEntity.ok().body(
            ApiResponse.builder()
                .data(response)
                .message("Get all categories")
                .build()
        );
    }
    @GetMapping("/search")
    public ResponseEntity<ApiResponse<?>> searchCategories(
        @RequestParam String keyword,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size,
        @RequestParam(defaultValue = "id") String sortBy,
        @RequestParam(defaultValue = "asc") String sortDirection
    ){
        
        Pageable pageable = PageableUtils.setPageable(page, size, sortDirection, sortBy);
        PageResponse<CategoryDto> response = categoryService.searchCategories(keyword, pageable);
        return ResponseEntity.ok().body(
            ApiResponse.builder()
                .data(response)
                .message("Search categories")
                .build()
        );
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE, path = "/admin")
    public ResponseEntity<ApiResponse<?>> createCategory(
        @RequestPart String  category,
        @RequestPart MultipartFile image 
        ){
            ObjectMapper objectMapper = new ObjectMapper();
            CategoryRequest categoryRequest = null;
            try{
                categoryRequest = objectMapper.readValue(category, CategoryRequest.class);
            }catch(Exception e){
                throw new RuntimeException("Invalid request body");
            }
        CategoryDto created = categoryService.createCategory(categoryRequest , image );
        return ResponseEntity.ok(
            ApiResponse.builder()
                .data(created)
                .message("Category created successfully")
                .build()
        );
    }

    @PutMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE, path = "/admin/{id}")
    public ResponseEntity<ApiResponse<?>> updateCategory(
        @PathVariable Long id, 
        @RequestPart (value = "category")String category ,
        @RequestPart (value = "image" , required = false)MultipartFile image
    ){
        ObjectMapper objectMapper = new ObjectMapper();
        CategoryRequest categoryRequest = null;
        try{
            categoryRequest = objectMapper.readValue(category, CategoryRequest.class);
        }catch(Exception e){
            throw new RuntimeException("Invalid request body");
        }
        CategoryDto updated = categoryService.updateCategory(id, categoryRequest , image );
        return ResponseEntity.ok(
            ApiResponse.builder()
                .data(updated)
                .message("Category updated successfully")
                .build()
        );
    }

    @DeleteMapping("/admin/{id}")
    public ResponseEntity<ApiResponse<?>> deleteCategory(@PathVariable Long id){
        categoryService.deleteCategoryById(id);
        return ResponseEntity.ok(
            ApiResponse.builder()
                .data(null)
                .message("Category deleted successfully")
                .build()
        );
    }
    
}
