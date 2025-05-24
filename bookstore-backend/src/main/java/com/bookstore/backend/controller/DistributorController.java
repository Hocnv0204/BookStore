package com.bookstore.backend.controller;

import com.bookstore.backend.dto.DistributorDto;
import com.bookstore.backend.dto.request.DistributorRequest;
import com.bookstore.backend.dto.response.PageResponse;
import com.bookstore.backend.service.DistributorService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

@RestController
@RequiredArgsConstructor
public class DistributorController {
    private final DistributorService distributorService;
    private static final int MAX_PAGE_SIZE = 20;

    private Pageable getPageable(Integer page, Integer size, String sortBy, String sortDirection) {
        int pageNumber = (page != null) ? page : 0;
        int pageSize = (size != null) ? Math.min(size, MAX_PAGE_SIZE) : 10;
        String sortField = (sortBy != null) ? sortBy : "id";
        Sort.Direction direction = (sortDirection != null) ? Sort.Direction.fromString(sortDirection) : Sort.Direction.ASC;
        return PageRequest.of(pageNumber, pageSize, Sort.by(direction, sortField));
    }

    @GetMapping("api/v1/distributors")
    public ResponseEntity<PageResponse<DistributorDto>> getAllDistributors(
            @RequestParam(value = "page", required = false) Integer page,
            @RequestParam(value = "size", required = false) Integer size,
            @RequestParam(value = "sortBy", required = false) String sortBy,
            @RequestParam(value = "sortOrder", required = false) String sortDirection) {
        Pageable pageable = getPageable(page, size, sortBy, sortDirection);
        return ResponseEntity.ok(distributorService.getAllDistributors(pageable));
    }

    @GetMapping("api/v1/distributors/{id}")
    public ResponseEntity<DistributorDto> getDistributorById(@PathVariable Long id) {
        return ResponseEntity.ok(distributorService.getDistributorById(id));
    }

    @GetMapping("api/v1/distributors/search")
    public ResponseEntity<PageResponse<DistributorDto>> searchDistributors(
            @RequestParam(required = false) String keyword,
            @RequestParam(value = "page", required = false) Integer page,
            @RequestParam(value = "size", required = false) Integer size,
            @RequestParam(value = "sortBy", required = false) String sortBy,
            @RequestParam(value = "sortOrder", required = false) String sortDirection) {
        Pageable pageable = getPageable(page, size, sortBy, sortDirection);
        if (keyword == null) {
            keyword = "";
        }
        return ResponseEntity.ok(distributorService.searchDistributors(keyword.trim(), pageable));
    }

    @PostMapping("admin/distributors")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<DistributorDto> createDistributor(@RequestBody DistributorRequest request) {
        return ResponseEntity.ok(distributorService.createDistributor(request));
    }

    @PutMapping("admin/distributors/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<DistributorDto> updateDistributor(
            @PathVariable Long id,
            @RequestBody DistributorRequest request) {
        return ResponseEntity.ok(distributorService.updateDistributor(id, request));
    }

    @DeleteMapping("admin/distributors/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteDistributor(@PathVariable Long id) {
        distributorService.deleteDistributor(id);
        return ResponseEntity.noContent().build();
    }
} 