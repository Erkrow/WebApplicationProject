package com.musicshop.backend.controller;

import com.musicshop.backend.dto.ProductRequest;
import com.musicshop.backend.model.Category;
import com.musicshop.backend.model.Product;
import com.musicshop.backend.repository.CategoryRepository;
import com.musicshop.backend.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    @Autowired
    public ProductController(ProductRepository productRepository, CategoryRepository categoryRepository) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
    }

    @GetMapping
    public List<Product> getAllProducts() {
        return productRepository.findAll(); // Zwraca wszystko z bazy jako JSON
    }

    @PostMapping
    public Product addProduct(@RequestBody ProductRequest productRequest) {
        Product product = new Product();
        product.setName(productRequest.getName());
        product.setBrand(productRequest.getBrand());
        product.setType(productRequest.getType());
        product.setPrice(productRequest.getPrice());
        product.setSpecs(productRequest.getSpecs());
        product.setDescription(productRequest.getDescription());
        product.setImageUrl(productRequest.getImageUrl());
        product.setStockQuantity(productRequest.getStockQuantity());

        Category category = categoryRepository.findByName(productRequest.getCategory());
        product.setCategory(category);

        return productRepository.save(product);
    }
}
