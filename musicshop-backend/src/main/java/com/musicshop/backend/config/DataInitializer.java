package com.musicshop.backend.config;

import com.musicshop.backend.model.Category;
import com.musicshop.backend.repository.CategoryRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * Inicjalizuje dane kategorii gitarowych przy pierwszym uruchomieniu serwera.
 * Idempotentny — sprawdza czy kategoria juz istnieje przed dodaniem.
 */
@Component
public class DataInitializer implements CommandLineRunner {

    private final CategoryRepository categoryRepository;

    public DataInitializer(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @Override
    public void run(String... args) {
        List<String> guitarCategories = List.of(
            "elektryczne",
            "akustyczne",
            "klasyczne",
            "basowe",
            "akcesoria"
        );

        for (String categoryName : guitarCategories) {
            // Sprawdz czy kategoria juz istnieje (case-insensitive)
            boolean exists = categoryRepository.findAll().stream()
                    .anyMatch(c -> c.getName().equalsIgnoreCase(categoryName));

            if (!exists) {
                Category category = new Category();
                category.setName(categoryName);
                category.setDescription("Kategoria: " + categoryName);
                categoryRepository.save(category);
                System.out.println("[DataInitializer] Dodano kategorie: " + categoryName);
            }
        }
    }
}
