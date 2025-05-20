package com.bookstore.backend.configuration;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Map;

@Configuration // Đánh dấu đây là một lớp cấu hình Spring
public class CloudinaryConfig {

    @Value("${cloudinary.cloud_name}")
    private String cloudName;

    @Value("${cloudinary.api_key}")
    private String apiKey;

    @Value("${cloudinary.api_secret}")
    private String apiSecret;



    @Bean // Đánh dấu phương thức này tạo ra một Spring Bean
    public Cloudinary cloudinary() {
        // Tạo một Map chứa thông tin cấu hình Cloudinary
        Map<String, String> config = ObjectUtils.asMap(
                "cloud_name", cloudName,
                "api_key", apiKey,
                "api_secret", apiSecret,
                "secure", true // Nên sử dụng HTTPS
        );
        return new Cloudinary(config);
    }
}