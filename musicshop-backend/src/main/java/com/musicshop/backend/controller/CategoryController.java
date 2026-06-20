package com.musicshop.backend.controller;

import com.musicshop.backend.model.Category;
import com.musicshop.backend.repository.CategoryRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    private final CategoryRepository categoryRepository;

    public CategoryController(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    // Publiczny — zwraca nazwy wszystkich kategorii do wyswietlenia w formularzu admina i CategoryNav
    @GetMapping
    public List<String> getAllCategories() {
        return categoryRepository.findAll().stream()
                .map(Category::getName)
                .sorted()
                .collect(Collectors.toList());
    }
}
