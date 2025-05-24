package com.bookstore.backend.service;

import com.bookstore.backend.dto.DistributorDto;
import com.bookstore.backend.dto.request.DistributorRequest;
import com.bookstore.backend.dto.response.PageResponse;
import org.springframework.data.domain.Pageable;

public interface DistributorService {
    PageResponse<DistributorDto> getAllDistributors(Pageable pageable);
    DistributorDto getDistributorById(Long id);
    PageResponse<DistributorDto> searchDistributors(String keyword, Pageable pageable);
    DistributorDto createDistributor(DistributorRequest request);
    DistributorDto updateDistributor(Long id, DistributorRequest request);
    void deleteDistributor(Long id);
} 