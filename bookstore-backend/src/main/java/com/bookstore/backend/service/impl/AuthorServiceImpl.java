package com.bookstore.backend.service.impl;

import com.bookstore.backend.dto.AuthorDto;
import com.bookstore.backend.mapper.AuthorMapper;
import com.bookstore.backend.model.Author;
import com.bookstore.backend.repository.AuthorRepository;
import com.bookstore.backend.service.AuthorService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AuthorServiceImpl implements AuthorService {
    private final AuthorRepository authorRepository ;
    @Override
    public AuthorDto createAuthor(AuthorDto dto) {
        Author author = AuthorMapper.toEntity(dto);
        return AuthorMapper.toDto(authorRepository.save(author));
    }

    @Override
    public AuthorDto getAuthorById(Long id) {
        Author author = authorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Author not found"));
        return AuthorMapper.toDto(author);
    }

    @Override
    public AuthorDto updateAuthor(Long id, AuthorDto dto) {
        Author author = authorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Author not found"));

        author.setName(dto.getName());
        author.setBio(dto.getBio());

        return AuthorMapper.toDto(authorRepository.save(author));
    }

    @Override
    public List<AuthorDto> getAllAuthors() {
        return authorRepository.findAll().stream()
                .map(AuthorMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteAuthorById(Long id) {
        authorRepository.deleteById(id);
    }
}
