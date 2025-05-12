package com.bookstore.backend.controller;

import com.bookstore.backend.service.FileStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequiredArgsConstructor
public class FileController {
    private final FileStorageService fileStorageService;

    @PostMapping("admin/upload/{subDirectory}")
    public ResponseEntity<String> uploadFile(
            @RequestParam("file") MultipartFile file,
            @PathVariable String subDirectory) {
        String fileName = fileStorageService.storeFile(file, subDirectory);
        String fileUrl = fileStorageService.getFileUrl(fileName, subDirectory);
        return ResponseEntity.ok(fileUrl);
    }

    @GetMapping("admin/{subDirectory}/{fileName:.+}")
    public ResponseEntity<String> getFileUrl(
            @PathVariable String subDirectory,
            @PathVariable String fileName) {
        String fileUrl = fileStorageService.getFileUrl(fileName, subDirectory);
        return ResponseEntity.ok(fileUrl);
    }

    @DeleteMapping("admin/{subDirectory}/{fileName:.+}")
    public ResponseEntity<Void> deleteFile(
            @PathVariable String subDirectory,
            @PathVariable String fileName) {
        String fileUrl = fileStorageService.getFileUrl(fileName, subDirectory);
        fileStorageService.deleteFile(fileUrl, subDirectory);
        return ResponseEntity.noContent().build();
    }
} 