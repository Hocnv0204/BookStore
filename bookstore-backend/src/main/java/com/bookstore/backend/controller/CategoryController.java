package com.bookstore.backend.controller;

import com.bookstore.backend.dto.CategoryDto;
import com.bookstore.backend.service.CategoryService;
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
@RequestMapping
public class CategoryController {
    private final CategoryService categoryService ;
    private static final int MAX_PAGE_SIZE = 20;
    @GetMapping("/api/v1/categories")
    public ResponseEntity<ApiResponse<PageResponse<CategoryDto>>> getAllCategories(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size,
        @RequestParam(defaultValue = "id") String sortBy,
        @RequestParam(defaultValue = "asc") String sortDirection
    ){
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.fromString(sortDirection), sortBy));
        size = Math.min(size, MAX_PAGE_SIZE);
        return ResponseEntity.ok().body(
            ApiResponse.<PageResponse<CategoryDto>>builder()
                .result(categoryService.getAllCategories(pageable))
                .build()
        );
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE, path = "/admin/categories")
    public ResponseEntity<CategoryDto> createCategory(
        @RequestPart String request , 
        @RequestPart MultipartFile image 
        ){
            ObjectMapper objectMapper = new ObjectMapper();
            CategoryRequest categoryRequest = null;
            try{
                categoryRequest = objectMapper.readValue(request, CategoryRequest.class);
            }catch(Exception e){
                throw new RuntimeException("Invalid request body");
            }
        return ResponseEntity.ok(categoryService.createCategory(categoryRequest , image ));
    }

    @PutMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE, path = "/admin/categories/{id}")
    public ResponseEntity<CategoryDto> updateCategory(
        @PathVariable Long id, 
        @RequestPart String request , 
        @RequestPart MultipartFile image 
    ){
        ObjectMapper objectMapper = new ObjectMapper();
        CategoryRequest categoryRequest = null;
        try{
            categoryRequest = objectMapper.readValue(request, CategoryRequest.class);
        }catch(Exception e){
            throw new RuntimeException("Invalid request body");
        }
        return ResponseEntity.ok(categoryService.updateCategory(id, categoryRequest , image ));
    }

    @DeleteMapping("/admin/categories/{id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable Long id){
        categoryService.deleteCategoryById(id);
        return ResponseEntity.noContent().build();
    }
    
}
