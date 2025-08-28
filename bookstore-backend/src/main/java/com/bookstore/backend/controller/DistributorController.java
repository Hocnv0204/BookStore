package com.bookstore.backend.controller;

import com.bookstore.backend.dto.DistributorDto;
import com.bookstore.backend.dto.request.DistributorRequest;
import com.bookstore.backend.dto.response.ApiResponse;
import com.bookstore.backend.dto.response.PageResponse;
import com.bookstore.backend.service.DistributorService;
import com.bookstore.backend.utils.PageableUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/distributors")
public class DistributorController {
    private final DistributorService distributorService;

    @GetMapping
    public ResponseEntity<ApiResponse<?>> getAllDistributors(
            @RequestParam(value = "page", required = false) Integer page,
            @RequestParam(value = "size", required = false) Integer size,
            @RequestParam(value = "sortBy", required = false) String sortBy,
            @RequestParam(value = "sortOrder", required = false) String sortDirection) {
        Pageable pageable = PageableUtils.setPageable(page, size, sortDirection, sortBy);
        PageResponse<DistributorDto> response = distributorService.getAllDistributors(pageable);
        return ResponseEntity.ok(
                ApiResponse.builder()
                        .data(response)
                        .message("Get all distributors")
                        .build()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<?>> getDistributorById(@PathVariable Long id) {
        DistributorDto distributor = distributorService.getDistributorById(id);
        return ResponseEntity.ok(
                ApiResponse.builder()
                        .data(distributor)
                        .message("Get distributor by id")
                        .build()
        );
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<?>> searchDistributors(
            @RequestParam(required = false) String keyword,
            @RequestParam(value = "page", required = false) Integer page,
            @RequestParam(value = "size", required = false) Integer size,
            @RequestParam(value = "sortBy", required = false) String sortBy,
            @RequestParam(value = "sortOrder", required = false) String sortDirection) {
        Pageable pageable = PageableUtils.setPageable(page, size, sortDirection, sortBy);
        if (keyword == null) {
            keyword = "";
        }
        PageResponse<DistributorDto> response = distributorService.searchDistributors(keyword.trim(), pageable);
        return ResponseEntity.ok(
                ApiResponse.builder()
                        .data(response)
                        .message("Search distributors")
                        .build()
        );
    }

    @PostMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<?>> createDistributor(@RequestBody DistributorRequest request) {
        DistributorDto created = distributorService.createDistributor(request);
        return ResponseEntity.ok(
                ApiResponse.builder()
                        .data(created)
                        .message("Distributor created successfully")
                        .build()
        );
    }

    @PutMapping("/admin/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<?>> updateDistributor(
            @PathVariable Long id,
            @RequestBody DistributorRequest request) {
        DistributorDto updated = distributorService.updateDistributor(id, request);
        return ResponseEntity.ok(
                ApiResponse.builder()
                        .data(updated)
                        .message("Distributor updated successfully")
                        .build()
        );
    }

    @DeleteMapping("/admin/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<?>> deleteDistributor(@PathVariable Long id) {
        distributorService.deleteDistributor(id);
        return ResponseEntity.ok(
                ApiResponse.builder()
                        .data(null)
                        .message("Distributor deleted successfully")
                        .build()
        );
    }
} 