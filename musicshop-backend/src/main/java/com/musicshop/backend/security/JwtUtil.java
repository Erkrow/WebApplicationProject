package com.musicshop.backend.security;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {

    // Generujemy bezpieczny, losowy klucz na potrzeby podpisywania tokenów
    private static final Key key = Keys.secretKeyFor(SignatureAlgorithm.HS256);
    private static final long EXPIRATION_TIME = 86400000; // Ważność: 24 godziny w milisekundach

    public String generateToken(String username, String role) {
        return Jwts.builder()
                .setSubject(username)           // Kto jest właścicielem tokenu
                .claim("role", role)            // Zapisujemy rolę (np. ROLE_ADMIN) w środku tokenu
                .setIssuedAt(new Date())        // Kiedy wydano
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME)) // Do kiedy ważny
                .signWith(key)                  // Cyfrowy podpis
                .compact();
    }

    public String extractUsername(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

    // NOWA METODA 2: Sprawdzanie, czy token jest prawidłowy i nie wygasł
    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}
