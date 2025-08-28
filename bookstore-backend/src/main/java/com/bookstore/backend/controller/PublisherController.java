package com.bookstore.backend.controller;

import com.bookstore.backend.dto.PublisherDto;
import com.bookstore.backend.dto.request.PublisherRequest;
import com.bookstore.backend.dto.response.ApiResponse;
import com.bookstore.backend.dto.response.PageResponse;
import com.bookstore.backend.service.PublisherService;
import com.bookstore.backend.utils.PageableUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/publishers")
public class PublisherController {
    private final PublisherService publisherService;

    @GetMapping
    public ResponseEntity<ApiResponse<?>> getAllPublishers(
            @RequestParam(value = "page", required = false) Integer page,
            @RequestParam(value = "size", required = false) Integer size,
            @RequestParam(value = "sortBy", required = false) String sortBy,
            @RequestParam(value = "sortOrder", required = false) String sortDirection) {
        Pageable pageable = PageableUtils.setPageable(page, size, sortDirection, sortBy);
        PageResponse<PublisherDto> response = publisherService.getAllPublishers(pageable);
        return ResponseEntity.ok(
                ApiResponse.builder()
                        .data(response)
                        .message("Get all publishers")
                        .build()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<?>> getPublisherById(@PathVariable Long id) {
        PublisherDto publisher = publisherService.getPublisherById(id);
        return ResponseEntity.ok(
                ApiResponse.builder()
                        .data(publisher)
                        .message("Get publisher by id")
                        .build()
        );
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<?>> searchPublishers(
            @RequestParam(required = false) String keyword,
            @RequestParam(value = "page", required = false) Integer page,
            @RequestParam(value = "size", required = false) Integer size,
            @RequestParam(value = "sortBy", required = false) String sortBy,
            @RequestParam(value = "sortOrder", required = false) String sortDirection) {
        Pageable pageable = PageableUtils.setPageable(page, size, sortDirection, sortBy);
        if (keyword == null) {
            keyword = "";
        }
        PageResponse<PublisherDto> response = publisherService.searchPublishers(keyword.trim(), pageable);
        return ResponseEntity.ok(
                ApiResponse.builder()
                        .data(response)
                        .message("Search publishers")
                        .build()
        );
    }

    @PostMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<?>> createPublisher(@RequestBody PublisherRequest request) {
        PublisherDto created = publisherService.createPublisher(request);
        return ResponseEntity.ok(
                ApiResponse.builder()
                        .data(created)
                        .message("Publisher created successfully")
                        .build()
        );
    }

    @PutMapping("/admin/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<?>> updatePublisher(
            @PathVariable Long id,
            @RequestBody PublisherRequest request) {
        PublisherDto updated = publisherService.updatePublisher(id, request);
        return ResponseEntity.ok(
                ApiResponse.builder()
                        .data(updated)
                        .message("Publisher updated successfully")
                        .build()
        );
    }

    @DeleteMapping("/admin/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<?>> deletePublisher(@PathVariable Long id) {
        publisherService.deletePublisher(id);
        return ResponseEntity.ok(
                ApiResponse.builder()
                        .data(null)
                        .message("Publisher deleted successfully")
                        .build()
        );
    }
} 