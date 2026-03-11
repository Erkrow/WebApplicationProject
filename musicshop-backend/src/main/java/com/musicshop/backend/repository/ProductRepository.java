package com.musicshop.backend.repository;

import com.musicshop.backend.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    // Rozszerzając JpaRepository, Spring Boot automatycznie dostarcza nam
    // gotowe metody takie jak findAll(), save() czy deleteById()
}
