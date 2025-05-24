package com.bookstore.backend.service;

import com.bookstore.backend.dto.PublisherDto;
import com.bookstore.backend.dto.request.PublisherRequest;
import com.bookstore.backend.dto.response.PageResponse;
import org.springframework.data.domain.Pageable;

public interface PublisherService {
    PageResponse<PublisherDto> getAllPublishers(Pageable pageable);
    PublisherDto getPublisherById(Long id);
    PageResponse<PublisherDto> searchPublishers(String keyword, Pageable pageable);
    PublisherDto createPublisher(PublisherRequest request);
    PublisherDto updatePublisher(Long id, PublisherRequest request);
    void deletePublisher(Long id);
} 