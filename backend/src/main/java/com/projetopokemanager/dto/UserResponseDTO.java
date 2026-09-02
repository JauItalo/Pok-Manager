package com.projetopokemanager.dto;

public record UserResponseDTO(
        Long id,
        String username,
        String email
) {
}