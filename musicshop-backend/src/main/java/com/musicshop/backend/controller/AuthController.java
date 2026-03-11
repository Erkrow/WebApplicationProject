package com.musicshop.backend.controller;

import com.musicshop.backend.dto.LoginRequest;
import com.musicshop.backend.model.User;
import com.musicshop.backend.repository.UserRepository;
import com.musicshop.backend.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.Optional;

@RequestMapping("/api/auth")
@RestController
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil; // Dodajemy naszego generatora tokenów

    @Autowired
    public AuthController(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/register")
    public User registerUser(@RequestBody User newUser) {
        newUser.setPassword(passwordEncoder.encode(newUser.getPassword()));
        newUser.setRole("ROLE_USER");
        return userRepository.save(newUser);
    }

    // --- NOWA METODA LOGOWANIA ---
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        // 1. Szukamy użytkownika po nazwie
        Optional<User> userOptional = userRepository.findByUsername(loginRequest.getUsername());

        if (userOptional.isPresent()) {
            User user = userOptional.get();
            // 2. Sprawdzamy, czy podane hasło (niezaszyfrowane) zgadza się z tym w bazie (zaszyfrowanym)
            if (passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
                // 3. Sukces! Generujemy token
                String token = jwtUtil.generateToken(user.getUsername(), user.getRole());

                // Zwracamy token jako JSON np. { "token": "eyJh..." }
                return ResponseEntity.ok(Collections.singletonMap("token", token));
            }
        }

        // 4. Jeśli login lub hasło są błędne, zwracamy błąd 401 (Brak autoryzacji)
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Błędny login lub hasło");
    }
}