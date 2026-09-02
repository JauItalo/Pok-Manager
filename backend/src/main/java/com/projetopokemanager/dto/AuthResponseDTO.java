package com.projetopokemanager.dto;

public record AuthResponseDTO(
        String token,
        String tokenType,
        String username
) {
}