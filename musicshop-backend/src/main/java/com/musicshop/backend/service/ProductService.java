package com.musicshop.backend.service;

import com.musicshop.backend.exception.ProductNotFoundException;
import com.musicshop.backend.model.Product;
import com.musicshop.backend.repository.CategoryRepository;
import com.musicshop.backend.repository.ProductRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    public ProductService(ProductRepository productRepository, CategoryRepository categoryRepository) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
    }

    public Page<Product> getProducts(Long categoryId, String query, Pageable pageable) {
        // This is a simplified implementation. A real implementation would use Specifications or Querydsl.
        if (categoryId != null) {
            return productRepository.findByCategoryId(categoryId, pageable);
        }
        if (query != null && !query.isEmpty()) {
            return productRepository.findByNameContaining(query, pageable);
        }
        return productRepository.findAll(pageable);
    }

    public Product getById(Long id) {
        return productRepository.findById(id).orElseThrow(ProductNotFoundException::new);
    }

    public Product create(Product product) {
        return productRepository.save(product);
    }

    public Product update(Long id, Product productDetails) {
        Product product = getById(id);
        product.setName(productDetails.getName());
        product.setBrand(productDetails.getBrand());
        product.setPrice(productDetails.getPrice());
        product.setDescription(productDetails.getDescription());
        product.setImageUrl(productDetails.getImageUrl());
        product.setStockQuantity(productDetails.getStockQuantity());
        product.setCategory(productDetails.getCategory());
        return productRepository.save(product);
    }

    public void delete(Long id) {
        productRepository.deleteById(id);
    }
}
