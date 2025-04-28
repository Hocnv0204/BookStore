package com.bookstore.backend.controller;

import com.bookstore.backend.dto.AuthorDto;
import com.bookstore.backend.service.AuthorService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/authors")
@RequiredArgsConstructor
public class AuthorController {
    private final AuthorService authorService ;

    @GetMapping
    public List<AuthorDto> getAllAuthors(){
        return authorService.getAllAuthors() ;
    }

    @PostMapping
    public AuthorDto createAuthor(@RequestBody AuthorDto dto){
        return authorService.createAuthor(dto) ;
    }

    @PutMapping("/{id}")
    public AuthorDto updateAuthor(@PathVariable Long id , @RequestBody AuthorDto dto){
        return authorService.updateAuthor(id , dto) ;
    }

    @GetMapping("/{id}")
    public AuthorDto getAuthorById(@PathVariable Long id){
        return authorService.getAuthorById(id) ;
    }

    @DeleteMapping("/{id}")
    public void deleteAuthorById(@PathVariable Long id){
         authorService.deleteAuthorById(id) ;
    }
}
