package com.bookstore.backend.service.impl;

import com.bookstore.backend.service.CloudinaryService;
import com.bookstore.backend.service.FileStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
@RequiredArgsConstructor
public class FileStorageServiceImpl implements FileStorageService {

    private final CloudinaryService cloudinaryService;

    @Override
    public String storeFile(MultipartFile file, String subDirectory) {
        try {
            return cloudinaryService.uploadFile(file, subDirectory);
        } catch (IOException e) {
            throw new RuntimeException("Failed to store file", e);
        }
    }

    @Override
    public void deleteFile(String fileUrl, String subDirectory) {
        // Cloudinary public_id = folder/filename (không có extension)
        // Ở đây giả sử fileUrl dạng: https://res.cloudinary.com/<cloud_name>/image/upload/v<version>/<folder>/<filename>
        String[] parts = fileUrl.split("/");
        String publicId = parts[parts.length - 2] + "/" + parts[parts.length - 1].split("\\.")[0];
        try {
            cloudinaryService.deleteFile(publicId);
        } catch (IOException e) {
            throw new RuntimeException("Failed to delete file", e);
        }
    }

    @Override
    public String getFileUrl(String fileName, String subDirectory) {
        // Cloudinary trả về URL khi upload, bạn nên lưu URL này vào DB và dùng lại
        // Nếu cần build lại URL, bạn có thể tự nối theo cấu trúc Cloudinary
        return  fileName;
    }
} 