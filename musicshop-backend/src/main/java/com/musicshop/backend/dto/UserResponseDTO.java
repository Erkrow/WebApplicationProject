package com.musicshop.backend.dto;

import com.musicshop.backend.model.User;

/**
 * DTO uzytkownika — nie eksponuje hasla (nawet hashu BCrypt) przez API.
 */
public class UserResponseDTO {

    private Long id;
    private String username;
    private String role;

    public UserResponseDTO() {}

    public static UserResponseDTO from(User user) {
        UserResponseDTO dto = new UserResponseDTO();
        dto.id = user.getId();
        dto.username = user.getUsername();
        dto.role = user.getRole();
        return dto;
    }

    public Long getId() { return id; }
    public String getUsername() { return username; }
    public String getRole() { return role; }

    public void setId(Long id) { this.id = id; }
    public void setUsername(String username) { this.username = username; }
    public void setRole(String role) { this.role = role; }
}
