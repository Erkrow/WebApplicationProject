package com.musicshop.backend.controller;

import com.musicshop.backend.dto.ProductRequest;
import com.musicshop.backend.dto.ProductResponseDTO;
import com.musicshop.backend.model.Category;
import com.musicshop.backend.model.Product;
import com.musicshop.backend.repository.CategoryRepository;
import com.musicshop.backend.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

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

    // Publiczny — pobieranie wszystkich produktow lub filtrowanie po category/search
    @GetMapping
    public List<ProductResponseDTO> getAllProducts(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String search) {

        List<Product> products = productRepository.findAll();

        if (category != null && !category.isBlank() && !category.equalsIgnoreCase("all")) {
            products = products.stream()
                    .filter(p -> p.getCategory() != null &&
                            p.getCategory().getName().equalsIgnoreCase(category))
                    .collect(Collectors.toList());
        }

        if (search != null && !search.isBlank()) {
            String q = search.toLowerCase();
            products = products.stream()
                    .filter(p -> (p.getName() != null && p.getName().toLowerCase().contains(q))
                            || (p.getBrand() != null && p.getBrand().toLowerCase().contains(q))
                            || (p.getType() != null && p.getType().toLowerCase().contains(q)))
                    .collect(Collectors.toList());
        }

        return products.stream()
                .map(ProductResponseDTO::from)
                .collect(Collectors.toList());
    }

    // Publiczny — pobieranie pojedynczego produktu
    @GetMapping("/{id}")
    public ResponseEntity<ProductResponseDTO> getProductById(@PathVariable Long id) {
        return productRepository.findById(id)
                .map(ProductResponseDTO::from)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Tylko ADMIN — dodawanie produktu
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ProductResponseDTO> addProduct(@RequestBody ProductRequest productRequest) {
        Product product = new Product();
        product.setName(productRequest.getName());
        product.setBrand(productRequest.getBrand());
        product.setType(productRequest.getType());
        product.setPrice(productRequest.getPrice());
        product.setSpecs(productRequest.getSpecs());
        product.setDescription(productRequest.getDescription());
        product.setImageUrl(productRequest.getImageUrl());
        product.setStockQuantity(productRequest.getStockQuantity());

        if (productRequest.getCategory() != null) {
            Category category = categoryRepository.findByNameIgnoreCase(productRequest.getCategory());
            product.setCategory(category);
        }

        Product saved = productRepository.save(product);
        return ResponseEntity.ok(ProductResponseDTO.from(saved));
    }

    // Tylko ADMIN — edycja produktu
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ProductResponseDTO> updateProduct(
            @PathVariable Long id, @RequestBody ProductRequest productRequest) {

        return productRepository.findById(id).map(product -> {
            if (productRequest.getName() != null) product.setName(productRequest.getName());
            if (productRequest.getBrand() != null) product.setBrand(productRequest.getBrand());
            if (productRequest.getType() != null) product.setType(productRequest.getType());
            if (productRequest.getPrice() != null) product.setPrice(productRequest.getPrice());
            if (productRequest.getSpecs() != null) product.setSpecs(productRequest.getSpecs());
            if (productRequest.getDescription() != null) product.setDescription(productRequest.getDescription());
            if (productRequest.getImageUrl() != null) product.setImageUrl(productRequest.getImageUrl());
            if (productRequest.getStockQuantity() != null) product.setStockQuantity(productRequest.getStockQuantity());
            if (productRequest.getCategory() != null) {
                Category category = categoryRepository.findByNameIgnoreCase(productRequest.getCategory());
                product.setCategory(category);
            }
            return ResponseEntity.ok(ProductResponseDTO.from(productRepository.save(product)));
        }).orElse(ResponseEntity.notFound().build());
    }

    // Tylko ADMIN — usuwanie produktu
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        if (!productRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        productRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
