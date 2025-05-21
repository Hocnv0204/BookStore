package com.bookstore.backend.service.impl;

import com.bookstore.backend.dto.CategoryDto;
import com.bookstore.backend.dto.request.adminrequest.CategoryRequest;
import com.bookstore.backend.dto.response.PageResponse;
import com.bookstore.backend.exception.AppException;
import com.bookstore.backend.common.enums.ErrorCode;
import com.bookstore.backend.mapper.CategoryMapper;
import com.bookstore.backend.model.Category;
import com.bookstore.backend.repository.CategoryRepository;
import com.bookstore.backend.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import com.bookstore.backend.service.FileStorageService;

import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class CategoryServiceImpl implements CategoryService {
    private final CategoryRepository categoryRepository;
    private final CategoryMapper categoryMapper;
    private final FileStorageService fileStorageService;
    @Override
    public PageResponse<CategoryDto> getAllCategories(Pageable pageable) {
        Page<Category> categoryPage = categoryRepository.findAll(pageable);
        return createPageResponse(categoryPage);
    }

    @Override
    public CategoryDto getCategoryById(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_FOUND));
        return categoryMapper.toDto(category);
    }

    @Override
    public CategoryDto createCategory(CategoryRequest request, MultipartFile image) {
        if(categoryRepository.existsByName(request.getName())){
            throw new AppException(ErrorCode.CATEGORY_ALREADY_EXISTS);
        }
        Category category = Category.builder()
        .name(request.getName())
        .build();
        if(image != null){
            String imageFileName = fileStorageService.storeFile(image, "categories");
            String imageUrl = fileStorageService.getFileUrl(imageFileName, "categories");
            category.setImageUrl(imageUrl);
        }
        return categoryMapper.toDto(categoryRepository.save(category));
    }

    @Override
    public CategoryDto updateCategory(
            Long id,
            CategoryRequest request,
            MultipartFile image) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_FOUND));
        category.setName(request.getName());
        if (image != null && !image.isEmpty()) {
            // Delete old image
            String oldImageUrl = category.getImageUrl();
        if (oldImageUrl != null && !oldImageUrl.isEmpty()) {
            fileStorageService.deleteFile(oldImageUrl, "categories");
        }
            // Store new image
            String newImageFileName = fileStorageService.storeFile(image, "books");
            String newImageUrl = fileStorageService.getFileUrl(newImageFileName, "books");
            category.setImageUrl(newImageUrl);
        }
        return categoryMapper.toDto(categoryRepository.save(category));
    }

    @Override
    public void deleteCategoryById(Long id) {
        if (!categoryRepository.existsById(id)) {
            throw new AppException(ErrorCode.CATEGORY_NOT_FOUND);
        }
        categoryRepository.deleteById(id);
    }

    @Override
    public PageResponse<CategoryDto> searchCategories(String keyword, Pageable pageable) {
        Page<Category> categoryPage = categoryRepository.searchCategories(keyword, pageable);
        return createPageResponse(categoryPage);
    }

    private PageResponse<CategoryDto> createPageResponse(Page<Category> categoryPage) {
        return PageResponse.<CategoryDto>builder()
                .content(categoryPage.getContent().stream()
                        .map(categoryMapper::toDto)
                        .collect(Collectors.toList()))
                .totalElements(categoryPage.getTotalElements())
                .totalPages(categoryPage.getTotalPages())
                .pageNumber(categoryPage.getNumber())
                .pageSize(categoryPage.getSize())
                .isLast(categoryPage.isLast())
                .build();
    }

}
