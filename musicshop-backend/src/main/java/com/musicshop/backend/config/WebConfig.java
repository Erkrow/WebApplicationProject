package com.musicshop.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**") // Pozwalamy na dostęp do wszystkich końcówek w /api/
                .allowedOrigins("http://localhost:5173") // Adres, na którym działa Twój serwer Vite (React)
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // Dozwolone operacje
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}
