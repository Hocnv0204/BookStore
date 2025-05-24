package com.bookstore.backend.service.impl;

import com.bookstore.backend.common.enums.ErrorCode;
import com.bookstore.backend.dto.DistributorDto;
import com.bookstore.backend.dto.request.DistributorRequest;
import com.bookstore.backend.dto.response.PageResponse;
import com.bookstore.backend.exception.AppException;
import com.bookstore.backend.model.Distributor;
import com.bookstore.backend.repository.DistributorRepository;
import com.bookstore.backend.service.DistributorService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class DistributorServiceImpl implements DistributorService {
    private final DistributorRepository distributorRepository;

    @Override
    public PageResponse<DistributorDto> getAllDistributors(Pageable pageable) {
        Page<Distributor> distributors = distributorRepository.findAll(pageable);
        return createPageResponse(distributors);
    }

    @Override
    public DistributorDto getDistributorById(Long id) {
        Distributor distributor = distributorRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.DISTRIBUTOR_NOT_FOUND));
        return mapToDto(distributor);
    }

    @Override
    public PageResponse<DistributorDto> searchDistributors(String keyword, Pageable pageable) {
        Page<Distributor> distributors = distributorRepository.findByNameContainingIgnoreCase(keyword, pageable);
        return createPageResponse(distributors);
    }

    @Override
    public DistributorDto createDistributor(DistributorRequest request) {
        // Check if distributor with same name or email already exists
        if (distributorRepository.existsByName(request.getName())) {
            throw new AppException(ErrorCode.DISTRIBUTOR_NAME_EXISTED);
        }
        if (distributorRepository.existsByEmail(request.getEmail())) {
            throw new AppException(ErrorCode.DISTRIBUTOR_EMAIL_EXISTED);
        }

        Distributor distributor = Distributor.builder()
                .name(request.getName())
                .address(request.getAddress())
                .phoneNumber(request.getPhoneNumber())
                .email(request.getEmail())
                .build();

        return mapToDto(distributorRepository.save(distributor));
    }

    @Override
    public DistributorDto updateDistributor(Long id, DistributorRequest request) {
        Distributor distributor = distributorRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.DISTRIBUTOR_NOT_FOUND));

        // Check if new name or email conflicts with existing distributors
        if (!distributor.getName().equals(request.getName()) && 
            distributorRepository.existsByName(request.getName())) {
            throw new AppException(ErrorCode.DISTRIBUTOR_NAME_EXISTED);
        }
        if (!distributor.getEmail().equals(request.getEmail()) && 
            distributorRepository.existsByEmail(request.getEmail())) {
            throw new AppException(ErrorCode.DISTRIBUTOR_EMAIL_EXISTED);
        }

        distributor.setName(request.getName());
        distributor.setAddress(request.getAddress());
        distributor.setPhoneNumber(request.getPhoneNumber());
        distributor.setEmail(request.getEmail());

        return mapToDto(distributorRepository.save(distributor));
    }

    @Override
    public void deleteDistributor(Long id) {
        if (!distributorRepository.existsById(id)) {
            throw new AppException(ErrorCode.DISTRIBUTOR_NOT_FOUND);
        }
        distributorRepository.deleteById(id);
    }

    private DistributorDto mapToDto(Distributor distributor) {
        return DistributorDto.builder()
                .id(distributor.getId())
                .name(distributor.getName())
                .address(distributor.getAddress())
                .phoneNumber(distributor.getPhoneNumber())
                .email(distributor.getEmail())
                .build();
    }

    private PageResponse<DistributorDto> createPageResponse(Page<Distributor> distributorPage) {
        return PageResponse.<DistributorDto>builder()
                .content(distributorPage.getContent().stream()
                        .map(this::mapToDto)
                        .collect(Collectors.toList()))
                .totalElements(distributorPage.getTotalElements())
                .totalPages(distributorPage.getTotalPages())
                .pageNumber(distributorPage.getNumber())
                .pageSize(distributorPage.getSize())
                .isLast(distributorPage.isLast())
                .build();
    }
} 