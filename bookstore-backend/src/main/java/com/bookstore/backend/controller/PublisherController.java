package com.bookstore.backend.controller;

import com.bookstore.backend.dto.PublisherDto;
import com.bookstore.backend.dto.request.PublisherRequest;
import com.bookstore.backend.dto.response.PageResponse;
import com.bookstore.backend.service.PublisherService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
public class PublisherController {
    private final PublisherService publisherService;
    private static final int MAX_PAGE_SIZE = 20;

    private Pageable getPageable(Integer page, Integer size, String sortBy, String sortDirection) {
        int pageNumber = (page != null) ? page : 0;
        int pageSize = (size != null) ? Math.min(size, MAX_PAGE_SIZE) : 10;
        String sortField = (sortBy != null) ? sortBy : "id";
        Sort.Direction direction = (sortDirection != null) ? Sort.Direction.fromString(sortDirection) : Sort.Direction.ASC;
        return PageRequest.of(pageNumber, pageSize, Sort.by(direction, sortField));
    }

    @GetMapping("api/v1/publishers")
    public ResponseEntity<PageResponse<PublisherDto>> getAllPublishers(
            @RequestParam(value = "page", required = false) Integer page,
            @RequestParam(value = "size", required = false) Integer size,
            @RequestParam(value = "sortBy", required = false) String sortBy,
            @RequestParam(value = "sortOrder", required = false) String sortDirection) {
        Pageable pageable = getPageable(page, size, sortBy, sortDirection);
        return ResponseEntity.ok(publisherService.getAllPublishers(pageable));
    }

    @GetMapping("api/v1/publishers/{id}")
    public ResponseEntity<PublisherDto> getPublisherById(@PathVariable Long id) {
        return ResponseEntity.ok(publisherService.getPublisherById(id));
    }

    @GetMapping("api/v1/publishers/search")
    public ResponseEntity<PageResponse<PublisherDto>> searchPublishers(
            @RequestParam(required = false) String keyword,
            @RequestParam(value = "page", required = false) Integer page,
            @RequestParam(value = "size", required = false) Integer size,
            @RequestParam(value = "sortBy", required = false) String sortBy,
            @RequestParam(value = "sortOrder", required = false) String sortDirection) {
        Pageable pageable = getPageable(page, size, sortBy, sortDirection);
        if (keyword == null) {
            keyword = "";
        }
        return ResponseEntity.ok(publisherService.searchPublishers(keyword.trim(), pageable));
    }

    @PostMapping("admin/publishers")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PublisherDto> createPublisher(@RequestBody PublisherRequest request) {
        return ResponseEntity.ok(publisherService.createPublisher(request));
    }

    @PutMapping("admin/publishers/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PublisherDto> updatePublisher(
            @PathVariable Long id,
            @RequestBody PublisherRequest request) {
        return ResponseEntity.ok(publisherService.updatePublisher(id, request));
    }

    @DeleteMapping("admin/publishers/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deletePublisher(@PathVariable Long id) {
        publisherService.deletePublisher(id);
        return ResponseEntity.noContent().build();
    }
} 