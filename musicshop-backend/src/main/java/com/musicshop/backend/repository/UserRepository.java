package com.musicshop.backend.repository;

import com.musicshop.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    // Ta metoda przyda nam się później do logowania!
    Optional<User> findByUsername(String username);
}
