package com.musicshop.backend.controller;

import com.musicshop.backend.model.Product;
import com.musicshop.backend.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductRepository productRepository;

    @Autowired
    public ProductController(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @GetMapping
    public List<Product> getAllProducts() {
        return productRepository.findAll(); // Zwraca wszystko z bazy jako JSON
    }

    @PostMapping
    public Product addProduct(@RequestBody Product product) {
        // Zapisuje produkt wysłany z Reacta prosto do bazy danych
        return productRepository.save(product);
    }
}
