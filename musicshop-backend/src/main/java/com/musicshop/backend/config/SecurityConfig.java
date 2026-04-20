package com.musicshop.backend.config;

import com.musicshop.backend.security.JwtFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {

    @Autowired
    private JwtFilter jwtFilter; // Wstrzykujemy naszego nowego Ochroniarza

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .cors(Customizer.withDefaults())
                .authorizeHttpRequests(auth -> auth
                        // Logowanie i Rejestracja są publiczne
                        .requestMatchers("/api/auth/**").permitAll()

                        // POBIERANIE produktów jest publiczne (żeby strona główna działała)
                        .requestMatchers(HttpMethod.GET, "/api/products/**").permitAll()

                        // DODAWANIE produktów tylko dla roli ADMIN!
                        // Uwaga: Spring domyślnie ucina przedrostek "ROLE_", więc wpisujemy samo "ADMIN"
                        .requestMatchers(HttpMethod.POST, "/api/products/**").hasRole("ADMIN")

                        // Reszta zablokowana
                        .anyRequest().authenticated()
                )
                // Ustawiamy naszego ochroniarza tuż przed standardowym sprawdzaniem hasła
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
