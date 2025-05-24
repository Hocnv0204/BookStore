package com.bookstore.backend.service.impl;

import com.bookstore.backend.common.enums.ErrorCode;
import com.bookstore.backend.dto.PublisherDto;
import com.bookstore.backend.dto.request.PublisherRequest;
import com.bookstore.backend.dto.response.PageResponse;
import com.bookstore.backend.exception.AppException;
import com.bookstore.backend.model.Publisher;
import com.bookstore.backend.repository.PublisherRepository;
import com.bookstore.backend.service.PublisherService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class PublisherServiceImpl implements PublisherService {
    private final PublisherRepository publisherRepository;

    @Override
    public PageResponse<PublisherDto> getAllPublishers(Pageable pageable) {
        Page<Publisher> publishers = publisherRepository.findAll(pageable);
        return createPageResponse(publishers);
    }

    @Override
    public PublisherDto getPublisherById(Long id) {
        Publisher publisher = publisherRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.PUBLISHER_NOT_FOUND));
        return mapToDto(publisher);
    }

    @Override
    public PageResponse<PublisherDto> searchPublishers(String keyword, Pageable pageable) {
        Page<Publisher> publishers = publisherRepository.findByNameContainingIgnoreCase(keyword, pageable);
        return createPageResponse(publishers);
    }

    @Override
    public PublisherDto createPublisher(PublisherRequest request) {
        // Check if publisher with same name or email already exists
        if (publisherRepository.existsByName(request.getName())) {
            throw new AppException(ErrorCode.PUBLISHER_NAME_EXISTED);
        }
        if (publisherRepository.existsByEmail(request.getEmail())) {
            throw new AppException(ErrorCode.PUBLISHER_EMAIL_EXISTED);
        }

        Publisher publisher = Publisher.builder()
                .name(request.getName())
                .address(request.getAddress())
                .phoneNumber(request.getPhoneNumber())
                .email(request.getEmail())
                .build();

        return mapToDto(publisherRepository.save(publisher));
    }

    @Override
    public PublisherDto updatePublisher(Long id, PublisherRequest request) {
        Publisher publisher = publisherRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.PUBLISHER_NOT_FOUND));

        // Check if new name or email conflicts with existing publishers
        if (!publisher.getName().equals(request.getName()) && 
            publisherRepository.existsByName(request.getName())) {
            throw new AppException(ErrorCode.PUBLISHER_NAME_EXISTED);
        }
        if (!publisher.getEmail().equals(request.getEmail()) && 
            publisherRepository.existsByEmail(request.getEmail())) {
            throw new AppException(ErrorCode.PUBLISHER_EMAIL_EXISTED);
        }

        publisher.setName(request.getName());
        publisher.setAddress(request.getAddress());
        publisher.setPhoneNumber(request.getPhoneNumber());
        publisher.setEmail(request.getEmail());

        return mapToDto(publisherRepository.save(publisher));
    }

    @Override
    public void deletePublisher(Long id) {
        if (!publisherRepository.existsById(id)) {
            throw new AppException(ErrorCode.PUBLISHER_NOT_FOUND);
        }
        publisherRepository.deleteById(id);
    }

    private PublisherDto mapToDto(Publisher publisher) {
        return PublisherDto.builder()
                .id(publisher.getId())
                .name(publisher.getName())
                .address(publisher.getAddress())
                .phoneNumber(publisher.getPhoneNumber())
                .email(publisher.getEmail())
                .build();
    }

    private PageResponse<PublisherDto> createPageResponse(Page<Publisher> publisherPage) {
        return PageResponse.<PublisherDto>builder()
                .content(publisherPage.getContent().stream()
                        .map(this::mapToDto)
                        .collect(Collectors.toList()))
                .totalElements(publisherPage.getTotalElements())
                .totalPages(publisherPage.getTotalPages())
                .pageNumber(publisherPage.getNumber())
                .pageSize(publisherPage.getSize())
                .isLast(publisherPage.isLast())
                .build();
    }
} 