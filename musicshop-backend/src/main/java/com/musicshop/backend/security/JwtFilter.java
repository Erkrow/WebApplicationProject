package com.musicshop.backend.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private CustomUserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        // 1. Szukamy nagłówka "Authorization" w zapytaniu
        String authHeader = request.getHeader("Authorization");

        // 2. Sprawdzamy, czy istnieje i czy zaczyna się od "Bearer " (standard JWT)
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7); // Odcinamy słowo "Bearer "

            // 3. Jeśli token jest prawidłowy...
            if (jwtUtil.validateToken(token)) {
                String username = jwtUtil.extractUsername(token);

                // 4. Pobieramy dane użytkownika i mówimy Spring Security, że ten gość jest zalogowany!
                if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                    UserDetails userDetails = userDetailsService.loadUserByUsername(username);

                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            userDetails, null, userDetails.getAuthorities());

                    SecurityContextHolder.getContext().setAuthentication(authToken);
                }
            }
        }

        // 5. Przepuszczamy zapytanie dalej (do kolejnych filtrów lub kontrolera)
        filterChain.doFilter(request, response);
    }
}
