package com.bookstore.backend.dto.request;

import lombok.Data;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

@Data
public class BookRequest {
    @NotBlank(message = "Title is required")
    @Size(max = 255, message = "Title must be less than 255 characters")
    private String title;

    @NotBlank(message = "Description is required")
    private String description;

    @NotNull(message = "Price is required")
    @Min(value = 0, message = "Price must be greater than or equal to 0")
    private Double price;

    @NotNull(message = "Quantity in stock is required")
    @Min(value = 0, message = "Quantity in stock must be greater than or equal to 0")
    private Integer quantityStock;

    @NotNull(message = "Author name is required")
    private String authorName;

    @NotNull(message = "Introduction is required")
    private String introduction;

    @NotNull(message = "Category ID is required")
    private Long categoryId;

    @NotNull(message = "Publisher ID is required")
    private Long publisherId;

    @NotNull(message = "Distributor ID is required")
    private Long distributorId;
} 